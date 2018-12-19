export const query = {
  async getAllContacts(obj, args, { store }) {
    const contacts = await store.scan('contacts');
    return contacts;
  }
};

export const mutation = {
  async createContact(obj, { ref, data }, { store, orgs }) {
    const contacts = await store.scan('contacts');
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

    await store.set(`contacts/${contact.id}`, contact);
    return contact;
  },
  async updateContact(obj, { id, data }, { store, orgs }) {
    let contact = await store.get(`contacts/${id}`);
    let contacts = await store.scan(`contacts`);

    console.log({ contacts, contact });

    if (!contact) {
      return null;
    }

    contact = await orgs.updateContact({ contact, data });

    if (!contact) {
      return null;
    }

    await store.set(`contacts/${id}`, contact);
    return contact;
  },
  async deleteContact(obj, { id }, { store }) {
    await store.del(`contacts/${id}`);
    return id;
  }
};
