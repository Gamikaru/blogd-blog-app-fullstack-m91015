// src/components/UserProfile/UserProfile.jsx

import { useNotificationContext, useUser, useUserUpdate } from '@contexts';
import { UserService, fetchPostsByUser } from '@services/api';
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
    const [profileUser, setProfileUser] = useState(user);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(user.status || '');
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (userId) {
                    const fetchedUser = await UserService.fetchUserById(userId);
                    setProfileUser(fetchedUser);
                    setStatus(fetchedUser.status || '');
                } else {
                    setProfileUser(user);
                    setStatus(user.status || '');
                }

                const response = await fetchPostsByUser(userId || user.userId);
                setUserPosts(Array.isArray(response.posts) ? response.posts : []);
            } catch (error) {
                logger.error('Error loading profile:', error);
                setUserPosts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, user]);

    if (loading || userLoading) {
        return <div className="loading-spinner">Loading profile...</div>;
    }

    const isOwnProfile = user.userId === profileUser.userId;

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
                status={status}
                handleStatusChange={handleStatusChange}
                handleStatusSubmit={handleStatusSubmit}
                statusLoading={statusLoading}
            />

            {/* Profile Grid */}
            <div className="profile-grid">
                {/* Sidebar Column */}
                <ProfileSidebar
                    profileUser={profileUser}
                    userPosts={userPosts}
                    isOwnProfile={isOwnProfile}
                />

                {/* Posts and Activity Column */}
                <div className="profile-main">
                    {/* Posts Section */}
                    <PostsSection
                        userPosts={userPosts}
                        isOwnProfile={isOwnProfile}
                    />

                    {/* Activity Section */}
                    {/* <div className="activity-and-connections">
                        <div className="activity-section">
                            <h3>
                                Recent Activity
                                <span className="section-action">View All</span>
                            </h3>
                            <div className="placeholder-content">
                                Activity timeline coming soon
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Connections Column
                <div className="profile-connections">
                    <ConnectionsSection />
                    {/* Additional Components or Stats can be added here */}
                {/* </div> */}
            </div>
        </div>
    );
};

export default UserProfile;
