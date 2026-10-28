import FreelancerGrid from '../components/FreelancerGrid.jsx';
import { useFreelance } from '../context/FreelanceContext.jsx';

function FreelancerList() {
    const { visibleFreelancers, freelancers, status } = useFreelance();

    const resultsText = status === 'loading'
        ? ''
        : `Showing ${visibleFreelancers.length} of ${freelancers.length} freelancers`;

    return (
        <>
            <p className="results-count results-line" role="status" aria-live="polite">
                {resultsText}
            </p>
            <FreelancerGrid
                freelancers={visibleFreelancers}
                emptyMessage="No freelancers match your search. Try changing the filters."
            />
        </>
    );
}

export default FreelancerList;
