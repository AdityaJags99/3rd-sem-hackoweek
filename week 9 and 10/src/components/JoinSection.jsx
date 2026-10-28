import { useState } from 'react';
import CategoryOptions from './CategoryOptions.jsx';
import FormStatus from './FormStatus.jsx';
import { simulateServer } from '../api.js';
import { validateProfile } from '../validation.js';
import { ValidationError, getErrorMessage } from '../errors.js';

const INITIAL_VALUES = {
    name: '',
    email: '',
    profession: '',
    skills: '',
    rate: '',
    availability: ''
};

function JoinSection({ onAddFreelancer }) {
    // Hooks (useState): the form values, the "saving" flag and the message.
    const [values, setValues] = useState(INITIAL_VALUES);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    // Controlled inputs: React state is the single source of truth.
    // One handler updates the right key using the input's "name".
    function handleChange(event) {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const profile = validateProfile(values);          // may throw ValidationError
            const savedProfile = await simulateServer(profile); // may throw NetworkError
            onAddFreelancer(savedProfile);                     // may throw StorageError

            setValues(INITIAL_VALUES);
            setStatus({
                type: 'success',
                message: `Welcome, ${savedProfile.name}! Your profile is now listed under Featured freelancers.`
            });
        } catch (error) {
            console.error(error);
            // Custom errors are handled by type with instanceof.
            const message = error instanceof ValidationError
                ? error.message
                : `Something went wrong: ${getErrorMessage(error)}`;
            setStatus({ type: 'error', message });
        } finally {
            setIsSubmitting(false);   // always runs, success or failure
        }
    }

    return (
        <section className="join-section" id="join" aria-labelledby="join-title">
            <div className="container join-grid">
                <div className="join-copy">
                    <p className="eyebrow">SHOWCASE YOUR TALENT</p>
                    <h2 id="join-title">Let clients discover your skills.</h2>
                    <p>
                        Create your freelancer profile, list your skills,
                        set your hourly rate, and tell clients what you do best.
                    </p>
                    <ul className="benefit-list">
                        <li>✓ Showcase your expertise</li>
                        <li>✓ Set your own hourly rate</li>
                        <li>✓ Connect with potential clients</li>
                    </ul>
                </div>

                <form className="form-card" onSubmit={handleSubmit} noValidate>
                    <h3>Create your profile</h3>
                    <p className="form-intro">Enter your professional details below.</p>

                    <div className="form-field">
                        <label htmlFor="freelancer-name">Full name</label>
                        <input
                            type="text"
                            id="freelancer-name"
                            name="name"
                            autoComplete="name"
                            placeholder="Your full name"
                            value={values.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="freelancer-email">Email address</label>
                        <input
                            type="email"
                            id="freelancer-email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="freelancer-category">Primary skill</label>
                        <select
                            id="freelancer-category"
                            name="profession"
                            value={values.profession}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose your profession</option>
                            <CategoryOptions />
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="freelancer-skills">Your skills</label>
                        <textarea
                            id="freelancer-skills"
                            name="skills"
                            rows="3"
                            placeholder="e.g. HTML, CSS, JavaScript"
                            value={values.skills}
                            onChange={handleChange}
                            required
                        />
                        <small>Separate each skill with a comma.</small>
                    </div>

                    <div className="form-field">
                        <label htmlFor="freelancer-rate">Hourly rate (₹)</label>
                        <input
                            type="number"
                            id="freelancer-rate"
                            name="rate"
                            min="1"
                            placeholder="e.g. 800"
                            value={values.rate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="freelancer-availability">Availability</label>
                        <select
                            id="freelancer-availability"
                            name="availability"
                            value={values.availability}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose availability</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="project-based">Project-based</option>
                        </select>
                    </div>

                    <button className="button button-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Create Freelancer Profile'}
                    </button>

                    <FormStatus id="join-status" status={status} />

                    <p className="form-note">
                        Demo form only. Your profile is saved in this browser
                        (localStorage) and is not sent to a server.
                    </p>
                </form>
            </div>
        </section>
    );
}

export default JoinSection;
