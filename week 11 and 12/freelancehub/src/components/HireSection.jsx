import { useState, useEffect, useRef } from 'react';
import SectionHeading from './SectionHeading.jsx';
import CategoryOptions from './CategoryOptions.jsx';
import FormStatus from './FormStatus.jsx';
import { simulateServer } from '../api.js';
import { storage } from '../storage.js';
import { validateProject } from '../validation.js';
import { STORAGE_KEYS, CATEGORIES } from '../constants.js';
import { ValidationError, getErrorMessage } from '../errors.js';

const INITIAL_VALUES = {
    clientName: '',
    clientEmail: '',
    preferredFreelancer: '',
    projectTitle: '',
    requiredSkill: '',
    budget: '',
    deadline: '',
    description: ''
};

/* "freelancer" comes from the route param: HirePage reads :freelancerId
   from /hire/:freelancerId and passes the matching freelancer (or null). */
function HireSection({ freelancer }) {
    const formRef = useRef(null);

    const [values, setValues] = useState(INITIAL_VALUES);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    // Runs after render whenever the selected freelancer changes.
    useEffect(() => {
        if (!freelancer) return;

        const categoryExists = CATEGORIES.some(
            (category) => category.value === freelancer.category
        );

        setValues((current) => ({
            ...current,
            preferredFreelancer: freelancer.name,
            requiredSkill: categoryExists ? freelancer.category : current.requiredSkill
        }));
    }, [freelancer]);

    function handleChange(event) {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const project = validateProject(values);
            const savedProject = await simulateServer(project);

            const projects = storage.get(STORAGE_KEYS.projects, []);
            projects.push(savedProject);
            storage.set(STORAGE_KEYS.projects, projects);

            setValues(INITIAL_VALUES);
            setStatus({
                type: 'success',
                message:
                    `Thanks! "${savedProject.projectTitle}" was submitted. ` +
                    `You have ${projects.length} saved project(s) in this browser.`
            });
        } catch (error) {
            console.error(error);

            if (error instanceof ValidationError) {
                formRef.current?.elements[error.field]?.focus();
                setStatus({ type: 'error', message: error.message });
            } else {
                setStatus({
                    type: 'error',
                    message: `Something went wrong: ${getErrorMessage(error)}`
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="hire-section" id="hire" aria-labelledby="hire-title">
            <div className="container hire-container">
                <SectionHeading
                    eyebrow="HAVE A PROJECT?"
                    title="Tell us what you need"
                    titleId="hire-title"
                >
                    <p>Describe your project and the skills you are looking for.</p>
                </SectionHeading>

                <form className="project-form" ref={formRef} onSubmit={handleSubmit} noValidate>
                    <div className="form-field">
                        <label htmlFor="client-name">Your name</label>
                        <input
                            type="text"
                            id="client-name"
                            name="clientName"
                            autoComplete="name"
                            value={values.clientName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="client-email">Email address</label>
                        <input
                            type="email"
                            id="client-email"
                            name="clientEmail"
                            autoComplete="email"
                            value={values.clientEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field full-width">
                        <label htmlFor="preferred-freelancer">Preferred freelancer (optional)</label>
                        <input
                            type="text"
                            id="preferred-freelancer"
                            name="preferredFreelancer"
                            placeholder="Click “Hire Me” on a profile to fill this in"
                            value={values.preferredFreelancer}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="project-title">Project title</label>
                        <input
                            type="text"
                            id="project-title"
                            name="projectTitle"
                            placeholder="e.g. Business website"
                            value={values.projectTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="required-skill">Required skill</label>
                        <select
                            id="required-skill"
                            name="requiredSkill"
                            value={values.requiredSkill}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a skill category</option>
                            <CategoryOptions />
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="project-budget">Budget (₹)</label>
                        <input
                            type="number"
                            id="project-budget"
                            name="budget"
                            min="1"
                            placeholder="Your project budget"
                            value={values.budget}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="project-deadline">Expected deadline</label>
                        <input
                            type="date"
                            id="project-deadline"
                            name="deadline"
                            value={values.deadline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field full-width">
                        <label htmlFor="project-description">Project description</label>
                        <textarea
                            id="project-description"
                            name="description"
                            rows="5"
                            placeholder="Describe the work and skills required..."
                            value={values.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="full-width">
                        <button className="button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Project Requirement'}
                        </button>
                    </div>

                    <FormStatus id="project-status" status={status} className="full-width" />

                    <p className="form-note full-width">
                        Demo form only. Project submissions are saved in this
                        browser (localStorage) and are not sent anywhere.
                    </p>
                </form>
            </div>
        </section>
    );
}

export default HireSection;
