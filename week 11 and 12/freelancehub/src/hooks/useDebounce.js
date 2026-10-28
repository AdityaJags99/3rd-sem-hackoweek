import { useState, useEffect } from 'react';

// Custom hook: returns "value" only after it stopped changing for "delay" ms.
export function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);   // cleanup: cancel the old timer
    }, [value, delay]);

    return debounced;
}
