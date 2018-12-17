export const query = {
  async getAllOrganizations(obj, args, { store, orgs }) {
    const { organizations = [] } = await store.get('organizations');
    return orgs.addRelationsToOrganization(organizations);
  },
  async getAllStages(obj, args, { store }) {
    const { stages = [] } = await store.get('stages');
    return stages;
  }
};

export const mutation = {
  async createContact(obj, { ref, data }, { store, orgs }) {
    const { contacts = [] } = await store.get('contacts');
    let contact;

    if (ref.id) {
      contact = contacts.find(c => c.ref && ref && c.ref.id === ref.id && c.ref.serviceId === ref.serviceId);
      if (contact) {
        return contact;
      }
    }

    contact = await orgs.createContact({ ref, data });

    if (!contact) {
      return null;
    }

    contacts.push(contact);
    await store.set('contacts', contacts);
    return contact;
  },
  async updateContact(obj, { id, data }, { store, orgs }) {
    const { contacts = [] } = await store.get('contacts');
    let contact = contacts.find(c => c.id === id);

    if (!contact) {
      return null;
    }

    contact = await orgs.updateContact({ contact, data });

    if (!contact) {
      return null;
    }

    contacts[contacts.findIndex(c => c.id === id)] = contact;
    await store.set('contacts', contacts);
    return contact;
  },
  async createOrganization(obj, { ref, data, stageId }, { orgs, store }) {
    const { organizations = [] } = await store.get('organizations');
    let organization;

    organization = await orgs.createOrganization({ ref, data, stageId });

    if (!organization) {
      return null;
    }

    organizations.push(organization);
    await store.set('organization', organization);
    return orgs.addRelationsToOrganization(organization);
  },
  async updateOrganization(obj, { id, data }, { store, orgs }) {
    const { organizations = [] } = await store.get('organizations');
    let organization = organizations.find(c => c.id === id);

    if (!organization) {
      return null;
    }

    organization = await orgs.updateOrganization({ organization, data });

    if (!organization) {
      return null;
    }

    organizations[organizations.findIndex(c => c.id === id)] = organization;
    await store.set('organizations', organizations);
    return orgs.addRelationsToOrganization(organization);
  },
  async deleteOrganization(obj, { id }, { store }) {
    let { organizations = [] } = await store.get('organizations');
    organizations = organizations.filter(p => p.id !== id);
    await store.set('organizations', organizations);
    return id;
  },
  async addContactToOrganization(obj, { id, contactId }, { store, orgs }) {
    const { organizations = [] } = await store.get('organizations');
    const organization = organizations.find(p => p.id === id);

    if (!organization) {
      return null;
    }

    if (!organization.contactIds.includes(contactId)) {
      organization.contactIds.push(contactId);
    }

    await store.set('organizations', organizations);

    return orgs.addRelationsToOrganization(organization);
  },
  async deleteContactFromOrganization(obj, { id, contactId }, { store, orgs }) {
    const { organizations = [] } = await store.get('organizations');
    const organization = organizations.find(p => p.id === id);

    if (!organization) {
      return null;
    }

    organization.contactIds = organization.contactIds.filter(id => id !== contactId);

    await store.set('organizations', organizations);

    return orgs.addRelationsToOrganization(organization);
  },
  async moveContactToOrganization(obj, { id, toOrganization, contactId }, { store, orgs }) {
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

    return orgs.addRelationsToOrganization([organizationFrom, organizationTo]);
  },
  async createStage(obj, { name }, { store, orgs }) {
    const { stages = [] } = await store.get('stages');
    const stage = orgs.createStage({ name });
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
