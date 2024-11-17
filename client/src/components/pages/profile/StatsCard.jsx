// components/pages/profile/StatsCard.jsx

import PropTypes from 'prop-types';

const StatsCard = ({ userPosts }) => {
    return (
        <div className="user-stats-card">
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-value">{userPosts.length}</div>
                    <div className="stat-label">Posts</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">48</div>
                    <div className="stat-label">Connections</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">156</div>
                    <div className="stat-label">Likes</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">23</div>
                    <div className="stat-label">Comments</div>
                </div>
            </div>
        </div>
    );
};

StatsCard.propTypes = {
    userPosts: PropTypes.array.isRequired,
};

export default StatsCard;
