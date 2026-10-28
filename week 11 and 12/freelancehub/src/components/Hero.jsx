import { Link } from 'react-router-dom';

const STATS = [
    { title: 'Expert', label: 'Freelancers' },
    { title: 'Flexible', label: 'Projects' },
    { title: 'Global', label: 'Opportunities' }
];

function Hero() {
    return (
        <section className="hero">
            <div className="container hero-content">
                <p className="eyebrow">YOUR SKILLS. YOUR OPPORTUNITIES.</p>
                <h1>
                    Find the right talent.<br />
                    <span>Build something great.</span>
                </h1>
                <p className="hero-description">
                    Connect talented freelancers with clients who need
                    their skills. Find work or hire the right person
                    for your next project.
                </p>

                <div className="hero-actions">
                    <Link className="button" to="/freelancers">Explore Freelancers</Link>
                    <Link className="button button-outline" to="/join">Become a Freelancer</Link>
                </div>

                <div className="hero-stats" aria-label="Platform highlights">
                    {STATS.map((stat) => (
                        <div key={stat.title}>
                            <strong>{stat.title}</strong>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;
