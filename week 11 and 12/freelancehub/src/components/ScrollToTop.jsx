import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to the top whenever the path changes, like a normal page load.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}

export default ScrollToTop;
