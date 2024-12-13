// components/pages/profile/StatsCard.jsx

import PropTypes from 'prop-types';

const StatsCard = ({ userPosts }) => {
    return (
        <div className="user-stats-card">
            <div className="user-stats-card__stats-grid">
                <div className="user-stats-card__stat-item">
                    <div className="user-stats-card__stat-value">{userPosts.length}</div>
                    <div className="user-stats-card__stat-label">Posts</div>
                </div>
                <div className="user-stats-card__stat-item">
                    <div className="user-stats-card__stat-value">48</div>
                    <div className="user-stats-card__stat-label">Connections</div>
                </div>
                <div className="user-stats-card__stat-item">
                    <div className="user-stats-card__stat-value">156</div>
                    <div className="user-stats-card__stat-label">Likes</div>
                </div>
                <div className="user-stats-card__stat-item">
                    <div className="user-stats-card__stat-value">23</div>
                    <div className="user-stats-card__stat-label">Comments</div>
                </div>
            </div>
        </div>
    );
};

StatsCard.propTypes = {
    userPosts: PropTypes.array.isRequired,
};

export default StatsCard;