import JoinSection from '../components/JoinSection.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function JoinPage() {
    useDocumentTitle('Join as a freelancer');
    return <JoinSection />;
}

export default JoinPage;
