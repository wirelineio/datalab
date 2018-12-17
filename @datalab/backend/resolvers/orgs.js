import hyperid from 'hyperid';
import { checkRemoteContact } from './contacts';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

export const addRelationsToOrganization = ({ store, executeInService }) => async record => {
  let [{ stages = [] }, { contacts = [] }] = await Promise.all([store.get('stages'), store.get('contacts')]);

  contacts = (await Promise.all(contacts.map(contact => checkRemoteContact({ contact, executeInService })))).filter(
    Boolean
  );

  if (Array.isArray(record)) {
    return record.map(r => {
      r.stage = stages.find(stage => stage.id === r.stageId);
      r.contacts = contacts.filter(c => r.contactIds && r.contactIds.includes(c.id));
      return r;
    });
  }

  record.stage = stages.find(stage => stage.id === record.stageId);
  record.contacts = contacts.filter(c => record.contactIds && record.contactIds.includes(c.id));
  return record;
};

export const query = {
  async getAllOrganizations(obj, args, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    return addRelationsToOrganization(organizations);
  },
  async getAllStages(obj, args, { store }) {
    const { stages = [] } = await store.get('stages');
    return stages;
  }
};

export const mutation = {
  async createOrganization(obj, args, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    const organization = Object.assign({}, args, { id: uuid(), contactIds: [] });
    organizations.push(organization);
    await store.set('organizations', organizations);
    return addRelationsToOrganization(organization);
  },
  async updateOrganization(obj, { id, ...args }, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    const idx = organizations.findIndex(p => p.id === id);

    if (idx === -1) {
      return null;
    }

    organizations[idx] = {
      ...organizations[idx],
      ...args
    };

    await store.set('organizations', organizations);

    return addRelationsToOrganization(organizations[idx]);
  },
  async deleteOrganization(obj, { id }, { store }) {
    let { organizations = [] } = await store.get('organizations');
    organizations = organizations.filter(p => p.id !== id);
    await store.set('organizations', organizations);
    return id;
  },
  async addContactToOrganization(obj, { id, contactId }, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    const organization = organizations.find(p => p.id === id);

    if (!organization) {
      return null;
    }

    if (!organization.contactIds.includes(contactId)) {
      organization.contactIds.push(contactId);
    }

    await store.set('organizations', organizations);

    return addRelationsToOrganization(organization);
  },
  async deleteContactFromOrganization(obj, { id, contactId }, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    const organization = organizations.find(p => p.id === id);

    if (!organization) {
      return null;
    }

    organization.contactIds = organization.contactIds.filter(id => id !== contactId);

    await store.set('organizations', organizations);

    return addRelationsToOrganization(organization);
  },
  async moveContactToOrganization(obj, { id, toOrganization, contactId }, { store, addRelationsToOrganization }) {
    const { organizations = [] } = await store.get('organizations');
    const organizationFrom = organizations.find(p => p.id === id);
    const organizationTo = organizations.find(p => p.id === toOrganization);

    if (!organizationFrom || !organizationTo) {
      return null;
    }

    organizationFrom.contactIds = organizationFrom.contactIds.filter(id => id !== contactId);
    if (!organizationTo.contactIds.includes(contactId)) {
      organizationTo.contactIds.push(contactId);
    }

    await store.set('organizations', organizations);

    return addRelationsToOrganization([organizationFrom, organizationTo]);
  },
  async createStage(obj, { name }, { store }) {
    const { stages = [] } = await store.get('stages');
    const stage = { id: uuid(), name };
    stages.push(stage);
    await store.set('stages', stages);
    return stage;
  },
  async updateStage(obj, { id, name }, { store }) {
    const { stages = [] } = await store.get('stages');
    const idx = stages.findIndex(s => s.id === id);

    stages[idx] = {
      id,
      name
    };

    await store.set('stages', stages);

    return stages[idx];
  },
  async deleteStage(obj, { id }, { store }) {
    let { stages = [] } = await store.get('stages');

    stages = stages.filter(s => s.id !== id);

    await store.set('stages', stages);

    return id;
  }
};
