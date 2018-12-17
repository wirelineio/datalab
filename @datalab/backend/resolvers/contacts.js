export const query = {
  async getAllContacts(obj, args, { store, executeInService }) {
    let { contacts = [] } = await store.get('contacts');

    contacts = (await Promise.all(contacts.map(contact => checkRemoteContact({ contact, executeInService })))).filter(
      Boolean
    );

    return contacts;
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
