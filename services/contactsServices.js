import Contact from "../models/contactModel.js";

async function listContacts(filter = {}) {
    return await Contact.findAll(filter);
}

async function getContactById(contactId, ownerId) {
    return await Contact.findOne({ where: { id: contactId, owner: ownerId } });
}

async function addContact(name, email, phone, favorite, owner) {
    return await Contact.create({ name, email, phone, favorite, owner });
}

async function removeContact(contactId, ownerId) {
    const contact = await getContactById(contactId, ownerId);
    if (!contact) return null;
    await contact.destroy();
    return contact;
}

async function updateContact(id, data, ownerId) {
    const contact = await getContactById(id, ownerId);
    if (!contact) return null;
    return await contact.update(data);
}

async function updateStatusContact(id, { favorite }, ownerId) {
    const contact = await getContactById(id, ownerId);
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