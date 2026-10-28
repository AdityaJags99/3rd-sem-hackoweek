import FreelancerCard from './FreelancerCard.jsx';

// Loading / empty / error box. "children" is an optional extra (the retry button).
function GridMessage({ message, children }) {
    return (
        <div className="grid-message">
            <p>{message}</p>
            {children}
        </div>
    );
}

function FreelancerGrid({ status, errorMessage, freelancers, favorites, onToggleFavorite, onHire, onRetry }) {
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
                onToggleFavorite={onToggleFavorite}
                onHire={onHire}
            />
        ));
    } else if (status === 'error') {
        content = (
            <GridMessage message={`We could not load the freelancer list. ${errorMessage}`}>
                <button
                    type="button"
                    className="button button-small retry-button"
                    onClick={onRetry}
                >
                    Try again
                </button>
            </GridMessage>
        );
    } else {
        content = <GridMessage message="No freelancers match your search. Try changing the filters." />;
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
