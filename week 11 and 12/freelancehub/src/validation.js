import { ValidationError } from './errors.js';
import { CATEGORIES, CATEGORY_ROLES } from './constants.js';

/* Each function checks the form values and either returns clean data
   or throws a ValidationError that names the field with the problem. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = CATEGORIES.map((category) => category.value);

function checkName(value, label, field = 'name') {
    const name = value.trim();
    if (name.length < 2) {
        throw new ValidationError(`${label} must be at least 2 characters.`, field);
    }
    return name;
}

function checkEmail(value, field = 'email') {
    const email = value.trim();
    if (!EMAIL_PATTERN.test(email)) {
        throw new ValidationError('Please enter a valid email address.', field);
    }
    return email;
}

function checkPositiveNumber(value, label, field) {
    const number = Number(value);
    if (value === '' || !Number.isFinite(number) || number <= 0) {
        throw new ValidationError(`${label} must be a number greater than 0.`, field);
    }
    return number;
}

export function validateProfile(values) {
    const name = checkName(values.name, 'Your name');
    checkEmail(values.email);

    const category = values.profession;
    if (![...VALID_CATEGORIES, 'other'].includes(category)) {
        throw new ValidationError('Please choose your profession.', 'profession');
    }

    const skills = values.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);
    if (skills.length === 0) {
        throw new ValidationError('Please enter at least one skill.', 'skills');
    }

    const rate = checkPositiveNumber(values.rate, 'Hourly rate', 'rate');

    if (!values.availability) {
        throw new ValidationError('Please choose your availability.', 'availability');
    }

    return {
        id: `p-${Date.now()}`,
        name,
        role: CATEGORY_ROLES[category],
        category,
        bio: `Available for ${values.availability.replace('-', ' ')} work.`,
        skills,
        rate,
        available: true
    };
}

export function validateProject(values) {
    const clientName = checkName(values.clientName, 'Your name', 'clientName');
    const clientEmail = checkEmail(values.clientEmail, 'clientEmail');

    const projectTitle = values.projectTitle.trim();
    if (projectTitle.length < 3) {
        throw new ValidationError('Project title must be at least 3 characters.', 'projectTitle');
    }

    if (!VALID_CATEGORIES.includes(values.requiredSkill)) {
        throw new ValidationError('Please select a skill category.', 'requiredSkill');
    }

    const budget = checkPositiveNumber(values.budget, 'Budget', 'budget');

    const today = new Date().toISOString().slice(0, 10);
    if (values.deadline && values.deadline < today) {
        throw new ValidationError('The deadline cannot be in the past.', 'deadline');
    }

    const description = values.description.trim();
    if (description.length < 10) {
        throw new ValidationError('Please describe the project in at least 10 characters.', 'description');
    }

    return {
        id: `job-${Date.now()}`,
        clientName,
        clientEmail,
        preferredFreelancer: values.preferredFreelancer.trim(),
        projectTitle,
        requiredSkill: values.requiredSkill,
        budget,
        deadline: values.deadline,
        description
    };
}
