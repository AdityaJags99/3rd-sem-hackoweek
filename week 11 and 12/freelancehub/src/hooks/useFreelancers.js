import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchFreelancers, wait } from '../api.js';
import { getErrorMessage } from '../errors.js';

/* Custom hook: loads freelancers.json and reports its status.
   Returns { freelancers, status, error, reload }.
   status is 'loading', 'success' or 'error'. */
export function useFreelancers() {
    const [freelancers, setFreelancers] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    // useRef stores a value that survives re-renders WITHOUT causing one.
    // Each request gets a number; only the newest request may update state.
    const latestRequest = useRef(0);

    useEffect(() => {
        const requestId = ++latestRequest.current;

        async function load() {
            setStatus('loading');
            setError('');

            try {
                const [data] = await Promise.all([fetchFreelancers(), wait(400)]);
                if (requestId === latestRequest.current) {
                    setFreelancers(data);
                    setStatus('success');
                }
            } catch (err) {
                console.error(err);
                if (requestId === latestRequest.current) {
                    setError(getErrorMessage(err));
                    setStatus('error');
                }
            }
        }

        load();
    }, [reloadKey]);

    // useCallback keeps the same function between renders.
    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { freelancers, status, error, reload };
}
