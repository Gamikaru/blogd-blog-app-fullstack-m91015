// components/pages/profile/ProfileHeader.jsx

import { Button, ProfilePicModal } from '@components';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ProfileHeader = ({
    isOwnProfile,
    userName,
    status,
    handleStatusChange,
    handleStatusSubmit,
    statusLoading,
    profilePicture
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPicModalOpen, setIsPicModalOpen] = useState(false);

    const handleProfilePictureClick = () => {
        setIsPicModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsPicModalOpen(false);
    };

    return (
        <div className="profile-header">
            <div className="profile-header__left">
                {/* User Picture */}
                <div className="profile-header__user-picture">
                    <img
                        src={profilePicture || '/images/default-avatar.png'}
                        alt={`${userName}'s Profile`}
                        className="profile-header__user-image clickable"
                        onClick={handleProfilePictureClick}
                    />
                </div>

                {/* User Name and Status */}
                <div className="profile-header__user-info">
                    {/* User Name */}
                    <h1 className="profile-header__user-name">{userName}</h1>

                    {/* User Status */}
                    {isOwnProfile ? (
                        <div className="profile-header__status-container">
                            <div className="profile-header__status-textarea-wrapper">
                                <textarea
                                    className="profile-header__status-textarea"
                                    value={status}
                                    onChange={handleStatusChange}
                                    placeholder="What's on your mind?"
                                    disabled={statusLoading}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                <Button
                                    variant="submit"
                                    onClick={handleStatusSubmit}
                                    disabled={statusLoading || !status.trim()}
                                    aria-label="Submit Status"
                                    className={`button button-submit ${isFocused ? 'active' : ''}`}
                                >
                                    {statusLoading ? 'Updating...' : 'Update Status'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                status && (
                    <h2 className="profile-header__user-status quote-style">
                        <span className="profile-header__opening-quote">“</span>
                        <em className="profile-header__status-text"
                            style={{ lineHeight: '1.5' }}>
                            {status}
                        </em><span className="profile-header__closing-quote">”</span>
                    </h2>
                )
            )}
            </div>
        </div>

            {/* Profile Picture Modal */ }
    {
        isPicModalOpen && (
            <ProfilePicModal
                imageUrl={profilePicture || '/images/default-avatar.png'}
                onClose={handleCloseModal}
            />
        )
    }
        </div >
    );
};

ProfileHeader.propTypes = {
    isOwnProfile: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    handleStatusSubmit: PropTypes.func.isRequired,
    statusLoading: PropTypes.bool.isRequired,
    profilePicture: PropTypes.string,
};

export default ProfileHeader;