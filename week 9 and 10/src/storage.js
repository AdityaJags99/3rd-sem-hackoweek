import { StorageError } from './errors.js';

/* localStorage wrapper (Week 8) that throws StorageError (Week 9).
   Callers decide how to handle the failure with try/catch. */

export const storage = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            throw new StorageError(`Could not read "${key}" from local storage.`, { cause: error });
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            throw new StorageError('Your browser blocked local storage.', { cause: error });
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            throw new StorageError(`Could not remove "${key}" from local storage.`, { cause: error });
        }
    }
};
