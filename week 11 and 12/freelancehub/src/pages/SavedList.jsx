import FreelancerGrid from '../components/FreelancerGrid.jsx';
import { useFreelance } from '../context/FreelanceContext.jsx';

function SavedList() {
    const { visibleSaved, favorites, status } = useFreelance();

    const resultsText = status === 'loading'
        ? ''
        : `Showing ${visibleSaved.length} of ${favorites.length} saved freelancers`;

    const emptyMessage = favorites.length === 0
        ? 'You have not saved anyone yet. Select the ♡ button on a profile to save it.'
        : 'None of your saved freelancers match the current filters.';

    return (
        <>
            <p className="results-count results-line" role="status" aria-live="polite">
                {resultsText}
            </p>
            <FreelancerGrid freelancers={visibleSaved} emptyMessage={emptyMessage} />
        </>
    );
}

export default SavedList;
