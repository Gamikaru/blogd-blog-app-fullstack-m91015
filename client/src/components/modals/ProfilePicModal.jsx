// ProfilePicModal.jsx
import { Button } from '@components';
import { useUser, useUserUpdate } from '@contexts';
import UserService from '@services/api/UserService';
import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

const ProfilePicModal = ({ imageUrl, onClose }) => {
    const { user } = useUser();
    const { updateUser } = useUserUpdate();
    const contentRef = useRef(null);
    const closeButtonRef = useRef(null);

    // Use the custom hook to detect clicks outside of the modal content
    useClickOutside(contentRef, onClose);

    // Handle focus for accessibility
    useEffect(() => {
        if (closeButtonRef.current) {
            closeButtonRef.current.focus();
        }

        // Handle Esc key to close the modal
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleDelete = async () => {
        try {
            await UserService.deleteProfilePicture(user.userId);
            await updateUser(user.userId, { profilePicture: null });
            onClose();
        } catch (error) {
            console.error('Error deleting profile picture:', error);
        }
    };

    const handleReplace = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await updateUser(user.userId, { profilePicture: file });
                onClose();
            } catch (error) {
                console.error('Error replacing profile picture:', error);
            }
        }
    };

    return (
        <div className="profile-pic-modal-overlay" role="dialog" aria-modal="true">
            <FocusTrap>
                <div className="profile-pic-modal-content" ref={contentRef}>
                    <Button
                        variant="close"
                        onClick={onClose}
                        aria-label="Close modal"
                        ref={closeButtonRef}
                        className="button button-close"
                    />
                    <img src={imageUrl} alt="Profile" />
                    <div className="profile-pic-modal-buttons">
                        <Button
                            variant="replace"
                            as="label"
                            htmlFor="replace-input"
                            className="button button-edit"
                        >
                            Replace
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            id="replace-input"
                            style={{ display: 'none' }}
                            onChange={handleReplace}
                        />
                        <Button
                            variant="delete"
                            onClick={handleDelete}
                            className="button button-delete"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    );
};

ProfilePicModal.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProfilePicModal;