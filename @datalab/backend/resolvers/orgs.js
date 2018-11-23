import hyperid from 'hyperid';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

export const addRelationsToPartner = store => async record => {
  const [{ stages = [] }, { contacts = [] }] = await Promise.all([store.get('stages'), store.get('contacts')]);

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

export const Query = {
  async getAllPartners(obj, args, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    return addRelationsToPartner(partners);
  },
  async getAllStages(obj, args, { store }) {
    const { stages = [] } = await store.get('stages');
    return stages;
  }
};

export const Mutation = {
  async createContact(obj, args, { store }) {
    const { contacts = [] } = await store.get('contacts');
    const contact = Object.assign({}, args, { id: uuid() });
    contacts.push(contact);
    await store.set('contacts', contacts);
    return contact;
  },
  async updateContact(obj, { id, ...args }, { store }) {
    const { contacts = [] } = await store.get('contacts');
    const idx = contacts.findIndex(c => c.id === id);

    if (idx === -1) {
      return null;
    }

    contacts[idx] = {
      ...contacts[idx],
      ...args
    };

    await store.set('contacts', contacts);
    return contacts[idx];
  },
  async createPartner(obj, args, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    const partner = Object.assign({}, args, { id: uuid(), contactIds: [] });
    partners.push(partner);
    await store.set('partners', partners);
    return addRelationsToPartner(partner);
  },
  async updatePartner(obj, { id, ...args }, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    const idx = partners.findIndex(p => p.id === id);

    if (idx === -1) {
      return null;
    }

    partners[idx] = {
      ...partners[idx],
      ...args
    };

    await store.set('partners', partners);

    return addRelationsToPartner(partners[idx]);
  },
  async deletePartner(obj, { id }, { store }) {
    let { partners = [] } = await store.get('partners');
    partners = partners.filter(p => p.id !== id);
    await store.set('partners', partners);
    return id;
  },
  async addContactToPartner(obj, { id, contactId }, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    const partner = partners.find(p => p.id === id);

    if (!partner) {
      return null;
    }

    if (!partner.contactIds.includes(contactId)) {
      partner.contactIds.push(contactId);
    }

    await store.set('partners', partners);

    return addRelationsToPartner(partner);
  },
  async deleteContactToPartner(obj, { id, contactId }, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    const partner = partners.find(p => p.id === id);

    if (!partner) {
      return null;
    }

    partner.contactIds = partner.contactIds.filter(id => id !== contactId);

    await store.set('partners', partners);

    return addRelationsToPartner(partner);
  },
  async moveContactToPartner(obj, { id, toPartner, contactId }, { store, addRelationsToPartner }) {
    const { partners = [] } = await store.get('partners');
    const partnerFrom = partners.find(p => p.id === id);
    const partnerTo = partners.find(p => p.id === toPartner);

    if (!partnerFrom || !partnerTo) {
      return null;
    }

    partnerFrom.contactIds = partnerFrom.contactIds.filter(id => id !== contactId);
    if (!partnerTo.contactIds.includes(contactId)) {
      partnerTo.contactIds.push(contactId);
    }

    await store.set('partners', partners);

    return addRelationsToPartner([partnerFrom, partnerTo]);
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
