import { AVATAR_COLORS } from '../constants.js';

function getInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

/* Receives data and callbacks as props. It owns no state: whether the
   card is saved is decided by App (lifting state up). */
function FreelancerCard({ freelancer, index, isSaved, onToggleFavorite, onHire }) {
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

            <h3>{freelancer.name}</h3>
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

                <a
                    className="button button-small hire-link"
                    href="#hire"
                    aria-label={`Hire ${freelancer.name}`}
                    onClick={() => onHire(freelancer)}
                >
                    Hire Me
                </a>
            </div>
        </article>
    );
}

export default FreelancerCard;
