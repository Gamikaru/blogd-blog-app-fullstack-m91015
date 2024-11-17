// components/pages/profile/ProfileHeader.jsx

import { Button } from '@components';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ProfileHeader = ({
    isOwnProfile,
    status,
    handleStatusChange,
    handleStatusSubmit,
    statusLoading
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="profile-header">
            <div className="status-container">
                {isOwnProfile ? (
                    <div className="status-input-container">
                        <div className="status-textarea-wrapper">
                            <textarea
                                className="status-textarea"
                                value={status}
                                onChange={handleStatusChange}
                                placeholder="What's on your mind?"
                                disabled={statusLoading}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            {isFocused && (
                                <Button
                                    variant="submit"
                                    onClick={handleStatusSubmit}
                                    disabled={statusLoading || !status.trim()}
                                    aria-label="Submit Status"
                                >
                                    {statusLoading ? 'Updating...' : 'Update Status'}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="user-status">
                        <p>{status}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

ProfileHeader.propTypes = {
    isOwnProfile: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    handleStatusSubmit: PropTypes.func.isRequired,
    statusLoading: PropTypes.bool.isRequired,
};

export default ProfileHeader;