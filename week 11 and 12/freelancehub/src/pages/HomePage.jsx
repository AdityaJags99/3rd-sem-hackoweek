import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import SearchForm from '../components/SearchForm.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function HomePage() {
    const navigate = useNavigate();
    useDocumentTitle('');

    return (
        <>
            <Hero />

            <section className="search-section" aria-labelledby="search-title">
                <div className="container">
                    <SectionHeading
                        eyebrow="HIRE WITH CONFIDENCE"
                        title="Find your perfect freelancer"
                        titleId="search-title"
                    >
                        <p>Explore professionals by their skills and expertise.</p>
                    </SectionHeading>

                    {/* Programmatic navigation: after searching, go to /freelancers */}
                    <SearchForm onSearch={() => navigate('/freelancers')} />
                </div>
            </section>
        </>
    );
}

export default HomePage;
