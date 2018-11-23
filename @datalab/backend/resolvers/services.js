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

export const query = {
  async getAllServices(obj, args, { store, mapServices }) {
    const { services = [] } = await store.get('services');
    return mapServices(services);
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
