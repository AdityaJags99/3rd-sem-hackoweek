import { Outlet } from 'react-router-dom';

function FreelancersPage() {
    return (
        <section className="freelancers-section" aria-label="Freelancers">
            <div className="container">
                <Outlet />
            </div>
        </section>
    );
}

export default FreelancersPage;
