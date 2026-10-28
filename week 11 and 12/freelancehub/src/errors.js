/* =========================================
   CUSTOM ERRORS (Week 9)
   Every class extends the built-in Error, so each one works with
   throw, try/catch and instanceof.
   ========================================= */

// Base class for every error that this app throws on purpose.
export class AppError extends Error {
    constructor(message, options) {
        super(message, options);   // options can carry { cause: originalError }
        this.name = 'AppError';
    }
}

// The request failed or the server answered with an HTTP error.
export class NetworkError extends AppError {
    constructor(message, status = null, options) {
        super(message, options);
        this.name = 'NetworkError';
        this.status = status;
    }
}

// The data we received is not in the shape we expected.
export class DataError extends AppError {
    constructor(message, options) {
        super(message, options);
        this.name = 'DataError';
    }
}

// localStorage could not be read, written or cleared.
export class StorageError extends AppError {
    constructor(message, options) {
        super(message, options);
        this.name = 'StorageError';
    }
}

// A form field has an invalid value. "field" tells which one.
export class ValidationError extends AppError {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Turns any caught error into text that is safe to show to the user.
// Errors we created ourselves have friendly messages; anything else
// (a bug, a browser problem) gets a generic message.
export function getErrorMessage(error) {
    if (error instanceof AppError) {
        return error.message;
    }
    return 'Something unexpected happened. Please try again.';
}
