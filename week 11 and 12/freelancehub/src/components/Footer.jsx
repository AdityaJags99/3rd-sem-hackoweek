import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-content">
                <Link className="logo footer-logo" to="/">
                    Freelance<span>Hub</span>
                </Link>
                <p>Connecting skills with opportunities.</p>
                <p>&copy; 2026 FreelanceHub. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
