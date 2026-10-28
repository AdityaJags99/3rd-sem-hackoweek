import { Link, NavLink } from 'react-router-dom';

/* Link / NavLink change the URL without reloading the page.
   NavLink automatically adds the class "active" to the link of the current route. */
function Header() {
    return (
        <header className="site-header">
            <nav className="navbar container" aria-label="Main navigation">
                <Link className="logo" to="/">Freelance<span>Hub</span></Link>

                <ul className="nav-links">
                    <li><NavLink to="/freelancers">Find Talent</NavLink></li>
                    <li><NavLink to="/join">Join as Freelancer</NavLink></li>
                    <li><NavLink to="/hire">Post a Project</NavLink></li>
                </ul>

                <Link className="button button-small" to="/join">Get Started</Link>
            </nav>
        </header>
    );
}

export default Header;
