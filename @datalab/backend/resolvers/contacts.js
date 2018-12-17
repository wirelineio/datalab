import hyperid from 'hyperid';

const uuid = hyperid({
  fixedLength: true,
  urlSafe: true
});

export const query = {
  async getAllContacts(obj, args, { store, executeInService }) {
    let { contacts = [] } = await store.get('contacts');

    contacts = (await Promise.all(contacts.map(contact => checkRemoteContact({ contact, executeInService })))).filter(
      Boolean
    );

    return contacts;
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
  async deleteContact(obj, { id }, { store }) {
    let { contacts = [] } = await store.get('contacts');
    contacts = contacts.filter(c => c.id !== id);
    await store.set('contacts', contacts);
    return id;
  }
};

export const mapRemoteContact = (contact, remoteContact) => ({
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
