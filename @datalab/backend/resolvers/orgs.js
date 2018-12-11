import hyperid from 'hyperid';

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

const mapRemoteContact = (contact, remoteContact) => ({
  ...contact,
  name: remoteContact.name,
  email: remoteContact.email,
  phone: remoteContact.phone
});

export const checkRemoteContact = async ({ contact, refContact, executeInService }) => {
  if (!contact || !contact.ref) {
    return contact;
  }

  if (refContact) {
    return mapRemoteContact(contact, refContact);
  }

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

  try {
    const { contact: remoteContact } = await executeInService({ query, variables, serviceId: contact.ref.serviceId });

    if (!remoteContact) {
      return null;
    }

    return mapRemoteContact(contact, remoteContact);
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
  async createContact(obj, { ref, data }, { store, executeInService }) {
    const { contacts = [] } = await store.get('contacts');
    let contact;

    if (ref.id) {
      contact = contacts.find(c => c.ref && ref && c.ref.id === ref.id && c.ref.serviceId === ref.serviceId);
      if (!contact) {
        contact = { id: uuid(), ref };
        contacts.push(contact);
        await store.set('contacts', contacts);
      }
    }

    if (contact) {
      return checkRemoteContact({ contact, executeInService });
    }

    if (!data) {
      return null;
    }

    const query = `
      mutation CreateContact($name: String!, $email: String, $phone: String) {
        contact: createContact(name: $name, email: $email, phone: $phone) {
          id
          name
          email
          phone
        }
      }
    `;

    try {
      const { contact: newContact } = await executeInService({ query, variables: data, serviceId: ref.serviceId });

      if (!newContact) {
        return null;
      }

      contact = { id: uuid(), ref: { id: newContact.id, serviceId: ref.serviceId } };
      contacts.push(contact);
      await store.set('contacts', contacts);
      return mapRemoteContact(contact, newContact);
    } catch (err) {
      console.log(err.message);
    }

    return null;
  },
  async updateContact(obj, { id, data }, { store, executeInService }) {
    const { contacts = [] } = await store.get('contacts');
    const contact = contacts.find(c => c.id === id);

    if (!contact) {
      return null;
    }

    const query = `
      mutation UpdateContact($id: ID!, $name: String!, $email: String, $phone: String) {
        contact: updateContact(id: $id, name: $name, email: $email, phone: $phone) {
          id
          name
          email
          phone
        }
      }
    `;

    try {
      const { contact: updatedContact } = await executeInService({
        query,
        variables: {
          id: contact.ref.id,
          ...data
        },
        serviceId: contact.ref.serviceId
      });

      if (!updatedContact) {
        return null;
      }

      return mapRemoteContact(contact, updatedContact);
    } catch (err) {
      console.log(err.message);
    }

    return null;
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
