import { HttpError } from './HttpError.js';

export class ConflictError extends HttpError {
    constructor(message) {
        super(message, 409);
    }
}
