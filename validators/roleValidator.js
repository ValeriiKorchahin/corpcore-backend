import Joi from 'joi';

export const roleSchema = Joi.object().keys({
    role: Joi.number().integer().required(),
});
