/* Shared constants used by several components. */

export const STORAGE_KEYS = {
    profiles: 'freelancehub:profiles',
    projects: 'freelancehub:projects',
    favorites: 'freelancehub:favorites',
    filters: 'freelancehub:filters'
};

export const AVATAR_COLORS = ['purple', 'orange', 'green'];

// Options for the category <select> elements (rendered with .map()).
export const CATEGORIES = [
    { value: 'development', label: 'Web Development' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'writing', label: 'Content Writing' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'data', label: 'Data Science' }
];

export const CATEGORY_ROLES = {
    development: 'Web Developer',
    design: 'UI/UX Designer',
    writing: 'Content Writer',
    marketing: 'Digital Marketer',
    data: 'Data Scientist',
    other: 'Freelancer'
};

export const RATE_OPTIONS = [
    { value: '500', label: '₹500/hour' },
    { value: '1000', label: '₹1,000/hour' },
    { value: '2000', label: '₹2,000/hour' }
];

export const EMPTY_FILTERS = {
    skill: '',
    category: '',
    rate: ''
};
