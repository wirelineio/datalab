export const query = {
  async getAllOrganizations(obj, args, { store, orgs }) {
    const organizations = await store.scan(null, { bucket: 'organizations' });
    return orgs.addRelationsToOrganization(organizations);
  },
  async getAllStages(obj, args, { store }) {
    return store.scan(null, { bucket: 'stages' });
  }
};

export const mutation = {
  async createOrganization(obj, { ref, data, stageId }, { orgs, store }) {
    const organizations = await store.scan(null, { bucket: 'organizations' });
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

    await store.set(organization.id, organization, { bucket: 'organizations' });
    return orgs.addRelationsToOrganization(organization);
  },
  async updateOrganization(obj, { id, data, stageId }, { store, orgs }) {
    let organization = await store.get(id, { bucket: 'organizations' });

    if (!organization) {
      return null;
    }

    organization = await orgs.updateOrganization({ organization, data, stageId });

    if (!organization) {
      return null;
    }

    await store.set(id, organization, { bucket: 'organizations' });
    return orgs.addRelationsToOrganization(organization);
  },
  async deleteOrganization(obj, { id }, { store }) {
    await store.del(id, { bucket: 'organizations' });
    return id;
  },
  async addContactToOrganization(obj, { id, contactId }, { store, orgs }) {
    const organization = await store.get(id, { bucket: 'organizations' });

    if (!organization) {
      return null;
    }

    if (!organization.contactIds.includes(contactId)) {
      organization.contactIds.push(contactId);
    }

    await store.set(id, organization, { bucket: 'organizations' });
    return orgs.addRelationsToOrganization(organization);
  },
  async deleteContactFromOrganization(obj, { id, contactId }, { store, orgs }) {
    const organization = await store.get(id, { bucket: 'organizations' });

    if (!organization) {
      return null;
    }

    organization.contactIds = organization.contactIds.filter(id => id !== contactId);

    await store.set(id, organization, { bucket: 'organizations' });
    return orgs.addRelationsToOrganization(organization);
  },
  async moveContactToOrganization(obj, { id, toOrganization, contactId }, { store, orgs }) {
    const [organizationFrom, organizationTo] = await Promise.all([
      store.get(id, { bucket: 'organizations' }),
      store.get(toOrganization, { bucket: 'organizations' })
    ]);

    if (!organizationFrom || !organizationTo) {
      return null;
    }

    organizationFrom.contactIds = organizationFrom.contactIds.filter(id => id !== contactId);
    if (!organizationTo.contactIds.includes(contactId)) {
      organizationTo.contactIds.push(contactId);
    }

    await Promise.all([
      store.set(id, organizationFrom, { bucket: 'organizations' }),
      store.set(toOrganization, organizationTo, { bucket: 'organizations' })
    ]);
    return orgs.addRelationsToOrganization([organizationFrom, organizationTo]);
  },
  async createStage(obj, { name }, { store, orgs }) {
    const stage = orgs.createStage({ name });
    await store.set(stage.id, stage, { bucket: 'stages' });
    return stage;
  },
  async updateStage(obj, { id, name }, { store }) {
    let stage = await store.get(id, { bucket: 'stages' });

    stage = {
      ...stage,
      name
    };

    await store.set(id, stage, { bucket: 'stages' });
    return stage;
  },
  async deleteStage(obj, { id }, { store }) {
    await store.del(id, { bucket: 'stages' });
    return id;
  }
};
