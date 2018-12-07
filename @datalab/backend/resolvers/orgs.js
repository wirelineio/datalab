import { request } from 'graphql-request';
import hyperid from 'hyperid';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

export const addRelationsToOrganization = ({ store, getAllEnabledServices }) => async record => {
  let [{ stages = [] }, { contacts = [] }] = await Promise.all([store.get('stages'), store.get('contacts')]);

  contacts = (await Promise.all(
    contacts.map(contact => checkRemoteContact({ contact, getAllEnabledServices }))
  )).filter(Boolean);

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

export const checkRemoteContact = async ({ contact, getAllEnabledServices }) => {
  if (!contact || !contact.ref) {
    return contact;
  }

  const services = await getAllEnabledServices({ cache: true });

  const query = `
    query GetContact($id: ID!) {
      contact: getContact(id: $id) {
        name
        email
        phone
      }
    }
  `;

  const variables = {
    id: contact.ref.id
  };

  const service = services.find(s => s.id === contact.ref.serviceId);
  if (!service) {
    return null;
  }

  try {
    const { contact: remoteContact } = await request(`${service.url}/gql`, query, variables);

    return {
      ...contact,
      name: remoteContact.name,
      email: remoteContact.email,
      phone: remoteContact.phone
    };
  } catch (err) {
    console.log(err.message);
  }

  return null;
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
  async createContact(obj, { ref, ...args }, { store, getAllEnabledServices }) {
    const { contacts = [] } = await store.get('contacts');
    let contact = contacts.find(c => c.ref && ref && c.ref.id === ref.id && c.ref.serviceId === ref.serviceId);

    if (!contact) {
      contact = Object.assign({}, args, { id: uuid(), ref });
      contacts.push(contact);
      await store.set('contacts', contacts);
    }

    return checkRemoteContact({ contact, getAllEnabledServices });
  },
  async updateContact(obj, { id, ref, ...args }, { store, getAllEnabledServices }) {
    const { contacts = [] } = await store.get('contacts');
    const idx = contacts.findIndex(c => c.id === id);

    if (idx === -1) {
      return null;
    }

    contacts[idx] = {
      ...contacts[idx],
      ...args,
      ref
    };

    await store.set('contacts', contacts);
    return checkRemoteContact({ contact: contacts[idx], getAllEnabledServices });
  },
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
  async deleteContactToOrganization(obj, { id, contactId }, { store, addRelationsToOrganization }) {
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
