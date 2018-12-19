export const query = {
  async getAllOrganizations(obj, args, { store, orgs }) {
    const organizations = await store.scan('organizations');
    return orgs.addRelationsToOrganization(organizations);
  },
  async getAllStages(obj, args, { store }) {
    return store.scan('stages');
  }
};

export const mutation = {
  async createOrganization(obj, { ref, data, stageId }, { orgs, store }) {
    const organizations = await store.scan('organizations');
    let organization;

    if (ref.id) {
      const used = organizations.find(o => o.ref && ref && o.ref.id === ref.id && o.ref.serviceId === ref.serviceId);
      if (used) {
        return null;
      }
    }

    organization = await orgs.createOrganization({ ref, data, stageId });

    if (!organization) {
      return null;
    }

    await store.set(`organizations/${organization.id}`, organization);
    return orgs.addRelationsToOrganization(organization);
  },
  async updateOrganization(obj, { id, data, stageId }, { store, orgs }) {
    let organization = await store.get(`organizations/${id}`);

    if (!organization) {
      return null;
    }

    organization = await orgs.updateOrganization({ organization, data, stageId });

    if (!organization) {
      return null;
    }

    await store.set(`organizations/${id}`, organization);
    return orgs.addRelationsToOrganization(organization);
  },
  async deleteOrganization(obj, { id }, { store }) {
    await store.del(`organizations/${id}`);
    return id;
  },
  async addContactToOrganization(obj, { id, contactId }, { store, orgs }) {
    const organization = await store.get(`organizations/${id}`);

    if (!organization) {
      return null;
    }

    if (!organization.contactIds.includes(contactId)) {
      organization.contactIds.push(contactId);
    }

    await store.set(`organizations/${id}`, organization);
    return orgs.addRelationsToOrganization(organization);
  },
  async deleteContactFromOrganization(obj, { id, contactId }, { store, orgs }) {
    const organization = await store.get(`organizations/${id}`);

    if (!organization) {
      return null;
    }

    organization.contactIds = organization.contactIds.filter(id => id !== contactId);

    await store.set(`organizations/${id}`, organization);
    return orgs.addRelationsToOrganization(organization);
  },
  async moveContactToOrganization(obj, { id, toOrganization, contactId }, { store, orgs }) {
    const [organizationFrom, organizationTo] = await Promise.all([
      store.get(`organizations/${id}`),
      store.get(`organizations/${toOrganization}`)
    ]);

    if (!organizationFrom || !organizationTo) {
      return null;
    }

    organizationFrom.contactIds = organizationFrom.contactIds.filter(id => id !== contactId);
    if (!organizationTo.contactIds.includes(contactId)) {
      organizationTo.contactIds.push(contactId);
    }

    await Promise.all([
      store.set(`organizations/${id}`, organizationFrom),
      store.set(`organizations/${toOrganization}`, organizationTo)
    ]);
    return orgs.addRelationsToOrganization([organizationFrom, organizationTo]);
  },
  async createStage(obj, { name }, { store, orgs }) {
    const stage = orgs.createStage({ name });
    await store.set(`stages/${stage.id}`, stage);
    return stage;
  },
  async updateStage(obj, { id, name }, { store }) {
    let stage = await store.get(`stages/${id}`);

    stage = {
      ...stage,
      name
    };

    await store.set(`stages/${id}`, stage);
    return stage;
  },
  async deleteStage(obj, { id }, { store }) {
    await store.del(`stages/${id}`);
    return id;
  }
};
