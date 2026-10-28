import SectionHeading from './SectionHeading.jsx';
import ResultsToolbar from './ResultsToolbar.jsx';
import FreelancerGrid from './FreelancerGrid.jsx';

function FreelancersSection({ toolbarProps, gridProps }) {
    return (
        <section
            className="freelancers-section"
            id="freelancers"
            aria-labelledby="freelancers-title"
        >
            <div className="container">
                <SectionHeading
                    eyebrow="MEET THE PROFESSIONALS"
                    title="Featured freelancers"
                    titleId="freelancers-title"
                >
                    <p>Discover people ready to bring your ideas to life.</p>
                </SectionHeading>

                <ResultsToolbar {...toolbarProps} />
                <FreelancerGrid {...gridProps} />
            </div>
        </section>
    );
}

export default FreelancersSection;
