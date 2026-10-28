import { Routes, Route } from 'react-router-dom';

import { FreelanceProvider } from './context/FreelanceContext.jsx';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import HomePage from './pages/HomePage.jsx';
import FreelancersPage from './pages/FreelancersPage.jsx';
import FreelancerListLayout from './pages/FreelancerListLayout.jsx';
import FreelancerList from './pages/FreelancerList.jsx';
import SavedList from './pages/SavedList.jsx';
import FreelancerProfile from './pages/FreelancerProfile.jsx';
import JoinPage from './pages/JoinPage.jsx';
import HirePage from './pages/HirePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/* ---------- React Router (Week 12) ----------
   URL                      What is shown
   /                        HomePage
   /freelancers             FreelancerList    (nested, index route)
   /freelancers/saved       SavedList         (nested)
   /freelancers/:id         FreelancerProfile (nested, route param)
   /join                    JoinPage
   /hire                    HirePage
   /hire/:id                HirePage with the freelancer pre-selected
   anything else            NotFoundPage                              */

function App() {
    return (
        <FreelanceProvider>
            <ScrollToTop />

            <Routes>
                {/* Layout route: Header + <Outlet /> + Footer around every page */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />

                    {/* Nested routes: FreelancersPage renders an <Outlet /> */}
                    <Route path="freelancers" element={<FreelancersPage />}>
                        {/* Pathless layout route: shares the search form and tabs */}
                        <Route element={<FreelancerListLayout />}>
                            <Route index element={<FreelancerList />} />
                            <Route path="saved" element={<SavedList />} />
                        </Route>

                        {/* Dynamic segment: useParams() reads freelancerId */}
                        <Route path=":freelancerId" element={<FreelancerProfile />} />
                    </Route>

                    <Route path="join" element={<JoinPage />} />
                    <Route path="hire" element={<HirePage />} />
                    <Route path="hire/:freelancerId" element={<HirePage />} />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </FreelanceProvider>
    );
}

export default App;
