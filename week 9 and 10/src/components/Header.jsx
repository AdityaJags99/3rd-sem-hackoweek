function Header() {
    return (
        <header className="site-header">
            <nav className="navbar container" aria-label="Main navigation">
                <a className="logo" href="#home">Freelance<span>Hub</span></a>

                <ul className="nav-links">
                    <li><a href="#freelancers">Find Talent</a></li>
                    <li><a href="#join">Join as Freelancer</a></li>
                    <li><a href="#hire">Post a Project</a></li>
                </ul>

                <a className="button button-small" href="#join">Get Started</a>
            </nav>
        </header>
    );
}

export default Header;
