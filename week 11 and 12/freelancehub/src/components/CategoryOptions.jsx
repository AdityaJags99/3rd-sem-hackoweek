import { CATEGORIES } from '../constants.js';

// Renders the <option> list once, so every <select> can reuse it.
function CategoryOptions() {
    return CATEGORIES.map((category) => (
        <option key={category.value} value={category.value}>
            {category.label}
        </option>
    ));
}

export default CategoryOptions;
