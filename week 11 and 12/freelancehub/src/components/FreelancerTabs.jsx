import { NavLink } from 'react-router-dom';
import { useFreelance } from '../context/FreelanceContext.jsx';

// Tabs are NavLinks to nested routes: /freelancers and /freelancers/saved.
// "end" stops the first tab from also being "active" on /freelancers/saved.
function FreelancerTabs() {
    const { favorites, clearFilters, clearSavedData, notice } = useFreelance();

    return (
        <div className="results-toolbar">
            <nav className="tabs" aria-label="Freelancer lists">
                <NavLink className="tab" to="/freelancers" end>All freelancers</NavLink>
                <NavLink className="tab" to="/freelancers/saved">
                    ♥ Saved ({favorites.length})
                </NavLink>
            </nav>

            <div className="toolbar-actions">
                <button
                    className="button button-small button-outline"
                    type="button"
                    onClick={clearFilters}
                >
                    Clear filters
                </button>
                <button
                    className="button button-small button-outline"
                    type="button"
                    onClick={clearSavedData}
                >
                    Clear saved data
                </button>
            </div>

            <p className="results-count" role="status" aria-live="polite">{notice}</p>
        </div>
    );
}

export default FreelancerTabs;
