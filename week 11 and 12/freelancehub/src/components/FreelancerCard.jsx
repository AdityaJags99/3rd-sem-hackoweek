import { memo } from 'react';
import { Link } from 'react-router-dom';
import { AVATAR_COLORS } from '../constants.js';
import { getInitials } from '../utils.js';

/* React.memo: the card re-renders only when its props change.
   This works because the parent passes a stable (useCallback) function
   and simple values. */
function FreelancerCard({ freelancer, index, isSaved, onToggleFavorite }) {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
        <article className="freelancer-card">
            <div className="profile-top">
                <div className={`avatar avatar-${color}`} aria-hidden="true">
                    {getInitials(freelancer.name)}
                </div>

                <div className="profile-actions">
                    <span className={`availability${freelancer.available ? '' : ' is-busy'}`}>
                        <span className="status-dot"></span>
                        {freelancer.available ? ' Available' : ' Booked'}
                    </span>

                    <button
                        type="button"
                        className="favorite-button"
                        aria-pressed={isSaved}
                        aria-label={`${isSaved ? 'Remove' : 'Save'} ${freelancer.name}`}
                        onClick={() => onToggleFavorite(freelancer.id)}
                    >
                        {isSaved ? '♥' : '♡'}
                    </button>
                </div>
            </div>

            {/* Route param: this link opens /freelancers/<id> */}
            <h3>
                <Link to={`/freelancers/${freelancer.id}`}>{freelancer.name}</Link>
            </h3>
            <p className="role">{freelancer.role}</p>
            <p className="bio">{freelancer.bio}</p>

            <ul className="skill-list" aria-label="Skills">
                {freelancer.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>

            <div className="card-footer">
                <p className="rate">
                    <strong>₹{freelancer.rate.toLocaleString('en-IN')}</strong>/hour
                </p>

                <Link
                    className="button button-small hire-link"
                    to={`/hire/${freelancer.id}`}
                    aria-label={`Hire ${freelancer.name}`}
                >
                    Hire Me
                </Link>
            </div>
        </article>
    );
}

export default memo(FreelancerCard);
