import Joi from "joi";
import { emailRegexp } from '../constants/user.js';

export const userSignupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required()
});

export const userLoginSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required()
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});