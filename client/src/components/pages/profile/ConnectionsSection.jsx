// components/pages/profile/ConnectionsSection.jsx

import { FiUsers } from 'react-icons/fi';

const ConnectionsSection = () => {
    return (
        <div className="connections-section">
            <h3 className="connections-section__header">
                <span className="connections-section__icon"><FiUsers /></span> Connections
                <span className="connections-section__action">View All</span>
            </h3>
            <div className="connections-section__placeholder-content">
                Connections grid coming soon
            </div>
        </div>
    );
};

export default ConnectionsSection;