import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts({
            where: { owner: req.user.id },
        });
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id, req.user.id);
        if (!contact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const removedContact = await contactsService.removeContact(id, req.user.id);
        if (!removedContact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(removedContact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { name, email, phone, favorite } = req.body;
        const newContact = await contactsService.addContact(name, email, phone, favorite, req.user.id);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedContact = await contactsService.updateContact(id, req.body, req.user.id);

        if (!updatedContact) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};

export const updateFavoriteStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await contactsService.updateStatusContact(id, req.body, req.user.id);
        if (!updated) throw HttpError(404, "Not found");
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};
