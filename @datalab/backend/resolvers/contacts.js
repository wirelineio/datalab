export const query = {
  async getAllContacts(obj, args, { store }) {
    const contacts = await store.scan(null, { bucket: 'contacts' });
    return contacts;
  }
};

export const mutation = {
  async createContact(obj, { ref, data }, { store, orgs }) {
    const contacts = await store.scan(null, { bucket: 'contacts' });
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

    await store.set(contact.id, contact, { bucket: 'contacts' });
    return contact;
  },
  async updateContact(obj, { id, data }, { store, orgs }) {
    let contact = await store.get(id, { bucket: 'contacts' });
    let contacts = await store.scan(null, { bucket: 'contacts' });

    console.log({ contacts, contact });

    if (!contact) {
      return null;
    }

    contact = await orgs.updateContact({ contact, data });

    if (!contact) {
      return null;
    }

    await store.set(id, contact, { bucket: 'contacts' });
    return contact;
  },
  async deleteContact(obj, { id }, { store }) {
    await store.del(id, { bucket: 'contacts' });
    return id;
  }
};
