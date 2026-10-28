import { useEffect } from 'react';

// Custom hook: sets the browser tab title for the current page.
export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title
            ? `${title} | FreelanceHub`
            : 'FreelanceHub | Find Your Talent';
    }, [title]);
}
