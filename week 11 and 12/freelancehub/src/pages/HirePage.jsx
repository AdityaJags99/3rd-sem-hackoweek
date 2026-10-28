import { useParams, Navigate } from 'react-router-dom';
import HireSection from '../components/HireSection.jsx';
import { useFreelance } from '../context/FreelanceContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Used for both /hire and /hire/:freelancerId.
function HirePage() {
    const { freelancerId } = useParams();   // undefined on plain /hire
    const { getFreelancerById, status } = useFreelance();

    const freelancer = freelancerId ? getFreelancerById(freelancerId) : null;
    useDocumentTitle('Post a project');

    // Unknown ID (after the list has loaded): redirect to the plain form.
    if (freelancerId && !freelancer && status === 'success') {
        return <Navigate to="/hire" replace />;
    }

    return <HireSection freelancer={freelancer} />;
}

export default HirePage;
