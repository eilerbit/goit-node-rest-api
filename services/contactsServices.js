import Contact from "../models/contactModel.js";

async function listContacts() {
    return await Contact.findAll();
}

async function getContactById(contactId) {
    return await Contact.findByPk(contactId);
}

async function addContact(name, email, phone) {
    return await Contact.create({ name, email, phone });
}

async function removeContact(contactId) {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    await contact.destroy();
    return contact;
}

async function updateContact(id, data) {
    const contact = await getContactById(id);
    if (!contact) return null;
    return await contact.update(data);
}

async function updateStatusContact(id, { favorite }) {
    const contact = await getContactById(id);
    if (!contact) return null;
    return await contact.update({ favorite });
}

export default {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,
};