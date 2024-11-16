// src/components/UserProfile/UserProfile.jsx
import { Button, PostCard } from '@components';
import { useNotificationContext, useUser, useUserUpdate } from '@contexts';
import { UserService, fetchPostsByUser } from '@services/api';
import { logger } from '@utils';
import { useEffect, useState } from 'react';
import {
    FiBook,
    FiCalendar,
    FiEdit,
    FiMail,
    FiMapPin,
    FiPhone,
    FiUsers
} from 'react-icons/fi';
import { useParams } from 'react-router-dom';

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
                } else {
                    setProfileUser(user);
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
            await updateUser(profileUser.userId, { status });
            logger.info('Status updated successfully');
        } catch (error) {
            logger.error('Error updating status:', error);
        } finally {
            setStatusLoading(false);
            showNotification({
                message: 'Status updated successfully',
                type:'success'
            });
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header">

                <h1>{isOwnProfile ? 'Your Status' : `${profileUser.firstName}'s Status`}</h1>
            </div>

            <div className="profile-grid">
                <div className="profile-sidebar">
                    <div className="user-stats-card">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-value">{userPosts.length}</div>
                                <div className="stat-label">Posts</div>
                            </div>
                            {/* Replace hard-coded values with dynamic data as needed */}
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

                    <div className="user-card">
                        <div className="user-info">
                            <h2>
                                {profileUser.firstName} {profileUser.lastName}
                            </h2>
                            <div className="user-role">{profileUser.role || 'User'}</div>
                        </div>
                        <div className="user-details">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <FiMail className="detail-icon" />
                                    <div className="detail-content">
                                        <div className="detail-label">Email</div>
                                        <div className="detail-value">{profileUser.email}</div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <FiPhone className="detail-icon" />
                                    <div className="detail-content">
                                        <div className="detail-label">Phone</div>
                                        <div className="detail-value">{profileUser.phone || 'Not provided'}</div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <FiMapPin className="detail-icon" />
                                    <div className="detail-content">
                                        <div className="detail-label">Location</div>
                                        <div className="detail-value">{profileUser.location || 'Not provided'}</div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <FiCalendar className="detail-icon" />
                                    <div className="detail-content">
                                        <div className="detail-label">Joined</div>
                                        <div className="detail-value">
                                            {new Date(profileUser.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            {isOwnProfile && (
                                <Button className="button button-edit">
                                    <FiEdit className="icon" />Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    {isOwnProfile && (
                        <div className="status-section">
                            <h3>Your Status</h3>
                            <textarea
                                className="status-textarea"
                                value={status}
                                onChange={handleStatusChange}
                                placeholder="What's on your mind?"
                                disabled={statusLoading}
                            />
                            <Button
                                className="button button-submit-status"
                                onClick={handleStatusSubmit}
                                disabled={statusLoading}
                            >
                                {statusLoading ? 'Updating...' : 'Update Status'}
                            </Button>
                        </div>
                    )}

                    <div className="activity-section">
                        <h3>
                            Recent Activity
                            <span className="section-action">View All</span>
                        </h3>
                        <div className="placeholder-content">
                            Activity timeline coming soon
                        </div>
                    </div>

                    <div className="posts-section">
                        <h3>
                            <span><FiBook /> Recent Posts</span>
                            <span className="section-action">View All</span>
                        </h3>
                        <PostCard posts={userPosts} isOwnProfile={isOwnProfile} />
                    </div>

                    <div className="connections-section">
                        <h3>
                            <span><FiUsers /> Connections</span>
                            <span className="section-action">View All</span>
                        </h3>
                        <div className="placeholder-content">
                            Connections grid coming soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
