import Joi  from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    organizationName: Joi.string().min(2).max(100).trim().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
});
