import hyperid from 'hyperid';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

export default class Organizations {
  constructor({ store, executeInService }) {
    this.store = store;
    this.executeInService = executeInService;
  }

  async sync({ local, remote, query, map }) {
    if (!local) {
      return null;
    }

    if (remote) {
      return map(local, remote);
    }

    const variables = {
      id: local.ref.id
    };

    try {
      const { result } = await this.executeInService({
        query,
        variables,
        serviceId: local.ref.serviceId
      });

      if (!result) {
        return null;
      }

      return map(local, result);
    } catch (err) {
      console.log(err.message);
    }

    return null;
  }

  syncContact(contact, remote) {
    const query = `
      query GetRemoteContact($id: ID!) {
        result: getRemoteContact(id: $id) {
          id
          name
          email
          phone
        }
      }
    `;

    return this.sync({
      local: contact,
      remote,
      query,
      map: (contact, remote) => ({
        ...contact,
        name: remote.name,
        email: remote.email,
        phone: remote.phone
      })
    });
  }

  syncOrganization(organization, remote) {
    const query = `
      query GetRemoteOrganization($id: ID!) {
        result: getRemoteOrganization(id: $id) {
          id
          name
          url
          goals
        }
      }
    `;

    return this.sync({
      local: organization,
      remote,
      query,
      map: (organization, remote) => ({
        ...organization,
        name: remote.name,
        url: remote.url,
        goals: remote.goals
      })
    });
  }

  async addRelationsToOrganization(organization) {
    let [stages, contacts] = await Promise.all([this.store.scan('stages'), this.store.scan('contacts')]);

    if (Array.isArray(organization)) {
      return organization.map(r => {
        r.stage = stages.find(stage => stage.id === r.stageId);
        r.contacts = contacts.filter(c => r.contactIds && r.contactIds.includes(c.id));
        return r;
      });
    }

    if (organization) {
      organization.stage = stages.find(stage => stage.id === organization.stageId);
      organization.contacts = contacts.filter(c => organization.contactIds && organization.contactIds.includes(c.id));
    }

    return organization;
  }

  async createContact({ ref, data }) {
    let contact = { id: uuid(), ref };

    if (ref.id) {
      return this.syncContact(contact);
    }

    if (!data) {
      return null;
    }

    const query = `
      mutation CreateRemoteContact($name: String!, $email: String, $phone: String) {
        contact: createRemoteContact(name: $name, email: $email, phone: $phone) {
          id
          name
          email
          phone
        }
      }
    `;

    const { contact: newContact } = await this.executeInService({
      query,
      variables: data,
      serviceId: ref.serviceId
    });

    if (!newContact) {
      return null;
    }

    contact.ref.id = newContact.id;
    return this.syncContact(contact, newContact);
  }

  async updateContact({ contact, data }) {
    const query = `
      mutation UpdateRemoteContact($id: ID!, $name: String!, $email: String, $phone: String) {
        contact: updateRemoteContact(id: $id, name: $name, email: $email, phone: $phone) {
          id
          name
          email
          phone
        }
      }
    `;

    const { contact: updatedContact } = await this.executeInService({
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

    return this.syncContact(contact, updatedContact);
  }

  async createOrganization({ ref, data, stageId }) {
    let organization = { id: uuid(), contactIds: [], stageId, ref };

    if (ref.id) {
      return this.syncOrganization(organization);
    }

    if (!data) {
      return null;
    }

    const query = `
      mutation CreateRemoteOrganization($name: String!, $url: String, $goals: String) {
        organization: createRemoteOrganization(name: $name, url: $url, goals: $goals) {
          id
          name
          url
          goals
        }
      }
    `;

    const { organization: newOrganization } = await this.executeInService({
      query,
      variables: data,
      serviceId: ref.serviceId
    });

    if (!newOrganization) {
      return null;
    }

    organization.ref.id = newOrganization.id;
    return this.syncOrganization(organization, newOrganization);
  }

  async updateOrganization({ organization, data, stageId }) {
    organization.stageId = stageId;

    if (!data) {
      return organization;
    }

    const query = `
      mutation UpdateRemoteOrganization($id: ID!, $name: String!, $url: String, $goals: String) {
        organization: updateRemoteOrganization(id: $id, name: $name, url: $url, goals: $goals) {
          id
          name
          url
          goals
        }
      }
    `;

    const { organization: updatedOrganization } = await this.executeInService({
      query,
      variables: {
        id: organization.ref.id,
        ...data
      },
      serviceId: organization.ref.serviceId
    });

    if (!updatedOrganization) {
      return null;
    }

    return this.syncOrganization(organization, updatedOrganization);
  }

  createStage({ name }) {
    return { id: uuid(), name };
  }
}
