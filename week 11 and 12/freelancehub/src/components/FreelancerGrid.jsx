import FreelancerCard from './FreelancerCard.jsx';
import { useFreelance } from '../context/FreelanceContext.jsx';

// Loading / empty / error box. "children" is an optional extra (the retry button).
function GridMessage({ message, children }) {
    return (
        <div className="grid-message">
            <p>{message}</p>
            {children}
        </div>
    );
}

function FreelancerGrid({ freelancers, emptyMessage }) {
    const { status, loadError, reload, favorites, toggleFavorite } = useFreelance();
    let content;

    if (status === 'loading') {
        content = <GridMessage message="Loading freelancers..." />;
    } else if (freelancers.length > 0) {
        content = freelancers.map((freelancer, index) => (
            <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                index={index}
                isSaved={favorites.includes(freelancer.id)}
                onToggleFavorite={toggleFavorite}
            />
        ));
    } else if (status === 'error') {
        content = (
            <GridMessage message={`We could not load the freelancer list. ${loadError}`}>
                <button
                    type="button"
                    className="button button-small retry-button"
                    onClick={reload}
                >
                    Try again
                </button>
            </GridMessage>
        );
    } else {
        content = <GridMessage message={emptyMessage} />;
    }

    return (
        <div
            className="freelancer-grid"
            id="freelancer-grid"
            aria-busy={status === 'loading'}
        >
            {content}
        </div>
    );
}

export default FreelancerGrid;
