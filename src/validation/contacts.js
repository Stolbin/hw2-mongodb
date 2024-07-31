import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().min(5).max(30).email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().min(5).max(30).email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});
