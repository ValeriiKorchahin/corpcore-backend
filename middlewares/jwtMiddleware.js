/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors/UnauthorizedError.js';
import { ForbiddenError } from '../utils/errors/ForbiddenError.js';

export const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return new UnauthorizedError('No token provided');
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return new ForbiddenError('Invalid or expired token');
    }
};
