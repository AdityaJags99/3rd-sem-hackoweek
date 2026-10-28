import { CATEGORIES } from './constants.js';

export function getInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

export function getCategoryLabel(category) {
    return CATEGORIES.find((item) => item.value === category)?.label ?? 'Other';
}
