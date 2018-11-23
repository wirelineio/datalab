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
  return services.filter(service =>
    service.versions.find(v =>
      v.functions.find(f => {
        try {
          eval(`(${f.description})`);
        } catch (err) {
          return false;
        }

        return true;
      })
    )
  );
};

const getDeployments = async ({ serviceId, compute }) => {
  const query = `
    query QueryStackDeploymentsByService($serviceId: String) {
      deployments: queryStackDeploymentsByService(serviceIds: [$serviceId]) {
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

export const query = {
  async getAllServices(obj, args, { store, mapServices, registry, compute }) {
    const services = await getServiceList(registry);

    const deployments = await Promise.all(
      services.map(s => getDeployments({ compute, serviceId: `example.com/${s.name}` }))
    );

    const { services: other = [] } = await store.get('services');
    return mapServices(other);
  }
};

export const mutation = {
  async switchService(obj, { id }, { store, mapServices }) {
    const [{ services }, { profiles }] = await Promise.all([store.get('services'), store.get('profiles')]);

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
