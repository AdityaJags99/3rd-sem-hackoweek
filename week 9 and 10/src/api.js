import { NetworkError, DataError } from './errors.js';

const DATA_URL = `${import.meta.env.BASE_URL}freelancers.json`;

// Promise-based delay (Week 7).
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch + async/await with custom errors (Weeks 7, 8 and 9).
export async function fetchFreelancers() {
    let response;

    try {
        response = await fetch(DATA_URL);
    } catch (error) {
        // fetch only rejects when the request itself fails (offline, blocked...).
        throw new NetworkError(
            'Could not reach the server. Check your internet connection.',
            null,
            { cause: error }
        );
    }

    // HTTP errors (404, 500...) do not reject, so check them manually.
    if (!response.ok) {
        throw new NetworkError(
            `The freelancer list could not be loaded (status ${response.status}).`,
            response.status
        );
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new DataError('The freelancer list is not valid JSON.', { cause: error });
    }

    if (!Array.isArray(data)) {
        throw new DataError('The freelancer list is in an unexpected format.');
    }

    return data;
}

// Pretend to send data to a server. Resolves after 700 ms.
export function simulateServer(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!data) {
                reject(new NetworkError('No data received by the server.'));
                return;
            }
            resolve({ ...data, savedAt: new Date().toISOString() });
        }, 700);
    });
}
