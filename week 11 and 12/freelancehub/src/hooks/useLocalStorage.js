import { useState, useEffect } from 'react';
import { readSaved, saveQuietly } from '../storage.js';

/* Custom hook: works like useState, but the value is also kept in
   localStorage.
   - useState gets a function (lazy initial value) so localStorage is read once.
   - useEffect saves the value every time it changes.
   The setter returned by useState is stable, so it is safe in dependency arrays. */
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => readSaved(key, initialValue));

    useEffect(() => {
        saveQuietly(key, value);
    }, [key, value]);

    return [value, setValue];
}
