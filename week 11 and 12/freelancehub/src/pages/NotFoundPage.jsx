import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Rendered by the path="*" route when no other route matches.
function NotFoundPage() {
    useDocumentTitle('Page not found');

    return (
        <section className="not-found container">
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>The page you are looking for does not exist or has moved.</p>
            <Link className="button" to="/">Go to the home page</Link>
        </section>
    );
}

export default NotFoundPage;
