import CategoryOptions from './CategoryOptions.jsx';
import { RATE_OPTIONS } from '../constants.js';
import { useFreelance } from '../context/FreelanceContext.jsx';

/* Controlled form that gets its data from context (useContext) instead of
   props. "onSearch" is the only prop: each page decides what happens
   when the form is submitted. */
function SearchForm({ onSearch }) {
    const { filters, updateFilter } = useFreelance();

    function handleChange(event) {
        updateFilter(event.target.name, event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSearch();
    }

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="skill-search">Skill or profession</label>
                <input
                    type="search"
                    id="skill-search"
                    name="skill"
                    placeholder="e.g. Web Developer"
                    value={filters.skill}
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="category-search">Category</label>
                <select
                    id="category-search"
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                >
                    <option value="">All categories</option>
                    <CategoryOptions />
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="budget-search">Maximum hourly rate</label>
                <select
                    id="budget-search"
                    name="rate"
                    value={filters.rate}
                    onChange={handleChange}
                >
                    <option value="">Any rate</option>
                    {RATE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <button className="button search-button" type="submit">
                Search
            </button>
        </form>
    );
}

export default SearchForm;
