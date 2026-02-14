/**
 * Custom Error Class for API errors
 * Allows specifying status codes and optional operational flag
 */
export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
