import { HttpError } from '../utils/errors/HttpError.js';

export const errorMiddleWare = (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }
};
