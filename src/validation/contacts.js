import Joi from "joi";
import { EMAIL_REGEX } from "../constants/constans.js";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  phoneNumber: Joi.string().min(5).max(25).required(),
  email: Joi.string().min(5).max(25).pattern(EMAIL_REGEX).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
  userId: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
  phoneNumber: Joi.string().min(5).max(25),
  email: Joi.string().min(5).max(25).pattern(EMAIL_REGEX),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});
