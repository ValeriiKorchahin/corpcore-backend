import { HttpError } from './HttpError.js';

export class NoFountError extends HttpError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
