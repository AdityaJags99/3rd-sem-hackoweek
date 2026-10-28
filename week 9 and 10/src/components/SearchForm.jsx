import SectionHeading from './SectionHeading.jsx';
import CategoryOptions from './CategoryOptions.jsx';
import { RATE_OPTIONS } from '../constants.js';

/* Controlled component: every value comes from the "filters" prop
   (state lifted up to App) and every change is sent back up with
   onFilterChange. */
function SearchForm({ filters, onFilterChange, onSearch }) {
    // Event handling: one handler for all three fields, using the "name" attribute.
    function handleChange(event) {
        onFilterChange(event.target.name, event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();   // stop the page from reloading
        onSearch();
    }

    return (
        <section className="search-section" aria-labelledby="search-title">
            <div className="container">
                <SectionHeading
                    eyebrow="HIRE WITH CONFIDENCE"
                    title="Find your perfect freelancer"
                    titleId="search-title"
                >
                    <p>Explore professionals by their skills and expertise.</p>
                </SectionHeading>

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
            </div>
        </section>
    );
}

export default SearchForm;
