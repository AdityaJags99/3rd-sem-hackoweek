import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// <Outlet /> is where the matching child route is rendered.
function Layout() {
    return (
        <>
            <Header />
            <main id="home">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Layout;
