// components/pages/profile/UserCard.jsx

import PropTypes from 'prop-types';
import { FiCalendar, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const UserCard = ({ profileUser }) => {
    return (
        <div className="user-card">
            <div className="user-card__header">
                <div className="user-card__info">
                    <h2 className="user-card__name">{profileUser.name}</h2>
                    <p className="user-card__role">{profileUser.role}</p>
                </div>
            </div>
            <div className="user-card__details">
                <div className="user-card__detail-grid">
                    <div className="user-card__detail-item">
                        <FiMail className="user-card__detail-icon" />
                        <div className="user-card__detail-content">
                            <div className="user-card__detail-label">Email</div>
                            <div className="user-card__detail-value">{profileUser.email}</div>
                        </div>
                    </div>
                    <div className="user-card__detail-item">
                        <FiPhone className="user-card__detail-icon" />
                        <div className="user-card__detail-content">
                            <div className="user-card__detail-label">Phone</div>
                            <div className="user-card__detail-value">{profileUser.phone || 'Not provided'}</div>
                        </div>
                    </div>
                    <div className="user-card__detail-item">
                        <FiMapPin className="user-card__detail-icon" />
                        <div className="user-card__detail-content">
                            <div className="user-card__detail-label">Location</div>
                            <div className="user-card__detail-value">{profileUser.location || 'Not provided'}</div>
                        </div>
                    </div>
                    <div className="user-card__detail-item">
                        <FiCalendar className="user-card__detail-icon" />
                        <div className="user-card__detail-content">
                            <div className="user-card__detail-label">Joined</div>
                            <div className="user-card__detail-value">
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