// components/pages/profile/QuickActions.jsx

import { Button } from '@components';
import { usePrivateModalContext } from '@contexts';
import PropTypes from 'prop-types';

const QuickActions = ({ isOwnProfile }) => {
    const { togglePrivateModal } = usePrivateModalContext();

    const handleEditProfile = () => {
        togglePrivateModal('userManager');
    };

    const handleCreatePost = () => {
        togglePrivateModal('post');
    };

    return (
        <div className="quick-actions">
            <h3 className="quick-actions__title">Quick Actions</h3>
            <div className="quick-actions__action-buttons">
                {isOwnProfile && (
                    <>
                        <Button
                            variant="edit"
                            onClick={handleEditProfile}
                            aria-label="Edit Profile"
                            style={{ marginTop: '0.2rem', padding: '2rem 1rem' }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="create"
                            onClick={handleCreatePost}
                            aria-label="Create Post"
                            style={{ marginTop: '0.2rem', padding: '2rem 1rem' }}

                        >
                            Create Post
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

QuickActions.propTypes = {
    isOwnProfile: PropTypes.bool.isRequired,
};

export default QuickActions;