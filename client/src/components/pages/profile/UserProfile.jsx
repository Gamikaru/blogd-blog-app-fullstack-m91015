// src/components/UserProfile/UserProfile.jsx

import { useNotificationContext, usePostContext, useUser, useUserUpdate } from '@contexts';
import { userService } from '@services/api';
import { logger } from '@utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostsSection from './PostsSection';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';

const UserProfile = () => {
    const { userId } = useParams();
    const { user, loading: userLoading } = useUser();
    const { updateUser } = useUserUpdate();
    const { showNotification } = useNotificationContext();
    const { loadPostsByUser, posts } = usePostContext();
    const [profileUser, setProfileUser] = useState(user);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(user.status || '');
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (userId && userId !== user.userId) {
                    const fetchedUser = await userService.fetchUserById(userId);
                    setProfileUser(fetchedUser);
                    setStatus(fetchedUser.status || '');
                } else {
                    setProfileUser(user);
                    setStatus(user.status || '');
                }

                loadPostsByUser(userId || user.userId);
            } catch (error) {
                logger.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, user, loadPostsByUser]);

    if (loading || userLoading) {
        return <div className="profile-page-container__loading-spinner">Loading profile...</div>;
    }

    const isOwnProfile = user.userId === profileUser.userId;
    const userName = `${profileUser.firstName} ${profileUser.lastName}`;
    const profilePicture = profileUser.profilePicture; // Extract profile picture

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleStatusSubmit = async () => {
        if (!isOwnProfile) return;
        try {
            setStatusLoading(true);
            const result = await updateUser(profileUser.userId, { status });
            if (result.success) {
                logger.info('Status updated successfully');
                showNotification('Status updated successfully', 'success');
            } else {
                logger.error('Failed to update status');
                showNotification('Failed to update status', 'error');
            }
        } catch (error) {
            logger.error('Error updating status:', error);
            showNotification('Failed to update status', 'error');
        } finally {
            setStatusLoading(false);
        }
    };

    return (
        <div className="profile-page-container">
            {/* Profile Header */}
            <ProfileHeader
                isOwnProfile={isOwnProfile}
                userName={userName}
                status={status}
                handleStatusChange={handleStatusChange}
                handleStatusSubmit={handleStatusSubmit}
                statusLoading={statusLoading}
                profilePicture={profilePicture} // Pass profilePicture prop
            />

            {/* Profile Grid */}
            <div className="profile-page-container__profile-grid">
                {/* Sidebar Column */}
                <ProfileSidebar
                    profileUser={profileUser}
                    userPosts={posts}
                    isOwnProfile={isOwnProfile}
                />

                {/* Posts and Activity Column */}
                <div className="profile-page-container__profile-main">
                    {/* Posts Section */}
                    <PostsSection
                        userPosts={posts}
                        isOwnProfile={isOwnProfile}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;