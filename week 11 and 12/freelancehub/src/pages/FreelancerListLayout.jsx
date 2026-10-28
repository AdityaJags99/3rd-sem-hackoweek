import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading.jsx';
import StatsBar from '../components/StatsBar.jsx';
import SearchForm from '../components/SearchForm.jsx';
import FreelancerTabs from '../components/FreelancerTabs.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Pathless layout route: shared by "/freelancers" and "/freelancers/saved".
function FreelancerListLayout() {
    const resultsRef = useRef(null);
    useDocumentTitle('Find freelancers');

    // useRef: scroll straight to the DOM element that holds the results.
    function scrollToResults() {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <SectionHeading
                eyebrow="MEET THE PROFESSIONALS"
                title="Featured freelancers"
                titleId="freelancers-title"
            >
                <p>Discover people ready to bring your ideas to life.</p>
            </SectionHeading>

            <StatsBar />
            <SearchForm onSearch={scrollToResults} />

            <div className="results-area" ref={resultsRef}>
                <FreelancerTabs />
                <Outlet />
            </div>
        </>
    );
}

export default FreelancerListLayout;
