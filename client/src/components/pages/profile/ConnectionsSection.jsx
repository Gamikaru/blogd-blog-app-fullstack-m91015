// components/pages/profile/ConnectionsSection.jsx

import { FiUsers } from 'react-icons/fi';

const ConnectionsSection = () => {
    return (
        <div className="connections-section">
            <h3>
                <span><FiUsers /> Connections</span>
                <span className="section-action">View All</span>
            </h3>
            <div className="placeholder-content">
                Connections grid coming soon
            </div>
        </div>
    );
};

export default ConnectionsSection;
