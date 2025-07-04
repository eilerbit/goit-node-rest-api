import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().optional(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
}).min(1);

export const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
});