import { useFreelance } from '../context/FreelanceContext.jsx';

// The numbers come from "stats", calculated with useMemo in the context.
function StatsBar() {
    const { stats, status } = useFreelance();

    if (status === 'loading' && stats.total === 0) return null;

    return (
        <div className="stats-bar" aria-label="Platform statistics">
            <span><strong>{stats.total}</strong> freelancers</span>
            <span><strong>{stats.available}</strong> available now</span>
            <span>
                Average rate <strong>₹{stats.averageRate.toLocaleString('en-IN')}</strong>/hour
            </span>
        </div>
    );
}

export default StatsBar;
