import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFreelance } from '../context/FreelanceContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { AVATAR_COLORS } from '../constants.js';
import { getInitials, getCategoryLabel } from '../utils.js';

/* Route params: this page is rendered for /freelancers/:freelancerId.
   useParams() returns { freelancerId: 'f1' } for /freelancers/f1. */
function FreelancerProfile() {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { getFreelancerById, status, favorites, toggleFavorite } = useFreelance();

    const freelancer = getFreelancerById(freelancerId);
    useDocumentTitle(freelancer ? freelancer.name : 'Freelancer profile');

    // location.key is "default" when this page was the first one opened,
    // so there is nothing to go back to inside the app.
    const canGoBack = location.key !== 'default';

    function handleBack() {
        navigate(canGoBack ? -1 : '/freelancers');
    }

    if (!freelancer) {
        return (
            <div className="not-found">
                <h2>{status === 'loading' ? 'Loading profile...' : 'Freelancer not found'}</h2>
                {status !== 'loading' && (
                    <>
                        <p>
                            There is no freelancer with the ID “{freelancerId}”.
                            They may have been removed.
                        </p>
                        <Link className="button" to="/freelancers">Browse all freelancers</Link>
                    </>
                )}
            </div>
        );
    }

    const isSaved = favorites.includes(freelancer.id);

    return (
        <article className="profile-detail">
            <button
                type="button"
                className="button button-small button-outline"
                onClick={handleBack}
            >
                ← Back
            </button>

            {location.state?.justCreated && (
                <p className="form-status form-status-success" role="status">
                    Welcome, {freelancer.name}! Your profile is now listed under Featured freelancers.
                </p>
            )}

            <div className="profile-head">
                <div className={`avatar avatar-${AVATAR_COLORS[0]}`} aria-hidden="true">
                    {getInitials(freelancer.name)}
                </div>
                <div>
                    <h2>{freelancer.name}</h2>
                    <p className="role">{freelancer.role}</p>
                </div>
            </div>

            <p className="bio">{freelancer.bio}</p>

            <ul className="skill-list" aria-label="Skills">
                {freelancer.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>

            <dl className="profile-meta">
                <div>
                    <dt>Category</dt>
                    <dd>{getCategoryLabel(freelancer.category)}</dd>
                </div>
                <div>
                    <dt>Hourly rate</dt>
                    <dd>₹{freelancer.rate.toLocaleString('en-IN')}</dd>
                </div>
                <div>
                    <dt>Availability</dt>
                    <dd>{freelancer.available ? 'Available' : 'Booked'}</dd>
                </div>
            </dl>

            <div className="profile-buttons">
                <Link className="button" to={`/hire/${freelancer.id}`}>
                    Hire {freelancer.name.split(' ')[0]}
                </Link>
                <button
                    type="button"
                    className="button button-outline"
                    aria-pressed={isSaved}
                    onClick={() => toggleFavorite(freelancer.id)}
                >
                    {isSaved ? '♥ Saved' : '♡ Save'}
                </button>
            </div>
        </article>
    );
}

export default FreelancerProfile;
