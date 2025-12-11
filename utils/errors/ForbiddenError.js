import { HttpError } from './HttpError.js';

export class ForbiddenError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(message, 403);
    }
};
