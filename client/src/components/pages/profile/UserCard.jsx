// components/pages/profile/UserCard.jsx

import PropTypes from 'prop-types';
import { FiCalendar, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const UserCard = ({ profileUser }) => {
    return (
        <div className="profile-user-card">
            <div className="profile-user-card-header">
                <div className="profile-user-info">
                    <h2>{profileUser.name}</h2>
                    <p className="profile-user-role">{profileUser.role}</p>
                </div>
            </div>
            <div className="profile-user-details">
                <div className="profile-detail-grid">
                    <div className="profile-detail-item">
                        <FiMail className="profile-detail-icon" />
                        <div className="profile-detail-content">
                            <div className="profile-detail-label">Email</div>
                            <div className="profile-detail-value">{profileUser.email}</div>
                        </div>
                    </div>
                    <div className="profile-detail-item">
                        <FiPhone className="profile-detail-icon" />
                        <div className="profile-detail-content">
                            <div className="profile-detail-label">Phone</div>
                            <div className="profile-detail-value">{profileUser.phone || 'Not provided'}</div>
                        </div>
                    </div>
                    <div className="profile-detail-item">
                        <FiMapPin className="profile-detail-icon" />
                        <div className="profile-detail-content">
                            <div className="profile-detail-label">Location</div>
                            <div className="profile-detail-value">{profileUser.location || 'Not provided'}</div>
                        </div>
                    </div>
                    <div className="profile-detail-item">
                        <FiCalendar className="profile-detail-icon" />
                        <div className="profile-detail-content">
                            <div className="profile-detail-label">Joined</div>
                            <div className="profile-detail-value">
                                {new Date(profileUser.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

UserCard.propTypes = {
    profileUser: PropTypes.shape({
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
        location: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserCard;
