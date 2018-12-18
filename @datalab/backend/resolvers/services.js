import { request } from 'graphql-request';
import { services, profiles } from '../data';

const DATALAB_LABEL = 'wire://datalab';
const SERVICE_TYPES = ['contacts', 'spellcheck'];

const serviceTypeByLabel = label => {
  const type = label.replace(`${DATALAB_LABEL}/`, '');
  return SERVICE_TYPES.find(t => t === type);
};

let init = false;
export const initServices = async store => {
  if (!init) {
    const admin = await store.get('profiles/admin');
    if (!admin) {
      await store.set('profiles/admin', profiles[0]);
    }
    await Promise.all(services.map(s => store.set(`services/${s.id}`, s)));
    init = true;
  }
};

export const mapProfiles = store => async services => {
  const profile = await store.get('profiles/admin');

  let onlyFirst = false;

  if (!Array.isArray(services)) {
    services = [services];
    onlyFirst = true;
  }

  const result = services.map(s => {
    s.enabled = !!profile.services.find(ps => ps.id === s.id && ps.enabled);

    return s;
  });

  if (onlyFirst) {
    return result[0];
  }

  return result;
};

const getServiceList = async registry => {
  const query = `
      query QueryServicesByLabels($domain: String, $labels: [String]!) {
        services: queryServicesByLabels(domain: $domain, labels: $labels) {
          domain
          name
          labels
          versions {
            functions {
              name
              description
            }
          }
        }
      }
    `;

  const variables = {
    domain: 'example.com',
    labels: [DATALAB_LABEL]
  };

  const { services } = await registry._client.query(query, variables);
  return services
    .map(s => {
      s.labels.forEach(label => {
        const type = serviceTypeByLabel(label);
        if (type) {
          s.type = type;
        }
      });
      return s;
    })
    .filter(s => !!s.type);
};

const getDeployments = async ({ domain, name, compute, wrnServices }) => {
  const query = `
    query QueryStackDeploymentsByService($serviceId: String) {
      deployments: queryStackDeploymentsByService(serviceIds: [$serviceId]) {
        domain
        endpointUrl
      }
    }
  `;

  const variables = {
    serviceId: `example.com/${name}`
  };

  const { deployments } = await compute._client.query(query, variables);
  let deployment = deployments && deployments.length ? deployments[0] : null;

  // support for `wire dev` local deployments
  if (wrnServices[name]) {
    const endpointUrl = wrnServices[name].endpoint;
    if (deployment) {
      deployment.endpointUrl = endpointUrl;
    } else {
      deployment = {
        domain,
        endpointUrl
      };
    }
  }

  return deployment;
};

export const addDeployments = async ({ services, compute, wrnServices }) => {
  const deployments = await Promise.all(
    services.map(async s => ({
      ...(await getDeployments({ compute, wrnServices, name: s.name, domain: 'example.com' })),
      type: s.type,
      name: s.name
    }))
  );

  return deployments
    .filter(s => !!s.endpointUrl)
    .map(({ name, domain, endpointUrl, type }) => ({
      id: `${domain}/${name}`,
      name,
      type,
      description: '',
      url: endpointUrl
    }));
};

let cacheMap = new Map();
export const getAllServices = ({ registry, compute, wrnServices }) => async ({ cache = false } = {}) => {
  let services;

  if (cache) {
    services = cacheMap.get('services') || [];
    if (services.length) {
      console.log('from cache!!');
      return services;
    }
  }

  services = addDeployments({ services: await getServiceList(registry), compute, wrnServices });
  cacheMap.set('services', services);
  return services;
};

export const getAllEnabledServices = ({ store, registry, compute, wrnServices }) => async (...args) => {
  const services = await getAllServices({ registry, compute, wrnServices })(...args);
  return (await mapProfiles(store)(services)).filter(s => s.enabled);
};

export const executeInService = getAllEnabledServices => async ({ query, variables, serviceId }) => {
  const services = await getAllEnabledServices({ cache: true });

  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return null;
  }

  return request(`${service.url}/gql`, query, variables);
};

export const query = {
  async getAllServices(obj, args, { mapProfiles, getAllServices }) {
    let services = await getAllServices();
    return mapProfiles(services);
  }
};

export const mutation = {
  async switchService(obj, { id }, { store, mapProfiles, getAllServices }) {
    const [services, profile] = await Promise.all([getAllServices(), store.get('profiles/admin')]);

    const service = profile.services.find(s => s.id === id);

    if (service) {
      service.enabled = !service.enabled;
    } else {
      profile.services.push({ id, enabled: true });
    }

    await store.set('profiles/admin', profile);

    return mapProfiles(services.find(s => s.id === id));
  }
};
