import { services, profiles } from '../data';

let init = false;
export const initServices = async store => {
  if (!init) {
    const { profiles: oldProfiles } = await store.get('profiles');
    if (!oldProfiles) {
      await store.set('profiles', profiles);
    }
    await store.set('services', services);
    init = true;
  }
};

export const mapServices = ({ wrnServices, store }) => async services => {
  const { profiles } = await store.get('profiles');

  const serviceIds = Object.keys(wrnServices);
  let onlyFirst = false;

  if (!Array.isArray(services)) {
    services = [services];
    onlyFirst = true;
  }

  const profile = profiles[0]; // admin

  const result = services.map(s => {
    const id = serviceIds.find(id => id.includes(s.id));

    if (id) {
      s.url = wrnServices[id].endpoint;
    }

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
      query QueryServices($domain: String) {
        services: queryServices(domain: $domain) {
          domain
          name
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
    domain: 'example.com'
  };

  const { services } = await registry._client.query(query, variables);
  return services
    .map(service => {
      service.versions.find(v =>
        v.functions.find(f => {
          try {
            const { interface: type } = JSON.parse(f.description);
            service.type = type.replace('wire://datalab/', '');
          } catch (err) {
            service.type = undefined;
            return false;
          }
          return true;
        })
      );
      return service;
    })
    .filter(s => !!s.type);
};

const getDeployments = async ({ serviceId, compute }) => {
  const query = `
    query QueryStackDeploymentsByService($serviceId: String) {
      deployments: queryStackDeploymentsByService(serviceIds: [$serviceId]) {
        domain
        name
        service
        endpointUrl
      }
    }
  `;

  const variables = {
    serviceId
  };

  const { deployments } = await compute._client.query(query, variables);

  return deployments && deployments.length ? deployments[0] : null;
};

export const addDeployments = async ({ services, compute }) => {
  const deployments = await Promise.all(
    services.map(async s => ({
      ...(await getDeployments({ compute, serviceId: `example.com/${s.name}` })),
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

export const query = {
  async getAllServices(obj, args, { mapServices, registry, compute }) {
    let services = await getServiceList(registry);
    services = await addDeployments({ services, compute });
    return mapServices(services);
  }
};

export const mutation = {
  async switchService(obj, { id }, { store, mapServices, registry, compute }) {
    let [services, { profiles }] = await Promise.all([getServiceList(registry), store.get('profiles')]);

    services = await addDeployments({ services, compute });

    const profile = profiles[0]; // admin

    const service = profile.services.find(s => s.id === id);

    if (service) {
      service.enabled = !service.enabled;
    } else {
      profile.services.push({ id, enabled: true });
    }

    await store.set('profiles', profiles);

    return mapServices(services.find(s => s.id === id));
  }
};
