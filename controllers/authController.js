import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { registerUser, loginUser } from '../services/authService.js';
import { BadRequestError } from '../utils/errors/BadRequestError.js';

export const register = async(req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const user = await registerUser(value);
        return res.status(200).send({ user });
    } catch(err) {
        next(err);
    }
};

export const login = async(req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        const user = await loginUser(value);
        return res.status(200).send({ user });
    } catch(err) {
        next(err);
    }
};

