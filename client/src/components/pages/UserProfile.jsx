// src/components/UserProfile/UserProfile.jsx

import { Button, PostCard } from '@components';
import { useUser } from '@contexts';
import { UserService, fetchPostsByUser } from '@services/api';
import { logger } from '@utils';
import { useEffect, useState } from 'react';
import {
    FiBook, FiCalendar, FiEdit, FiMail, FiMapPin,
    FiPhone,
    FiUsers
} from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { userId } = useParams(); // Correct parameter name based on route
    const { user } = useUser();
    const [profileUser, setProfileUser] = useState(user); // State for the profile being viewed
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log('UserId from useParams:', userId, typeof userId);
    console.log('Current user from context:', user);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (userId) {
                    // Fetch selected user's data if userId is present
                    const fetchedUser = await UserService.fetchUserById(userId);
                    setProfileUser(fetchedUser);
                } else {
                    // Default to current user if no userId is provided
                    setProfileUser(user);
                }

                // Fetch posts for the selected user or current user
                const response = await fetchPostsByUser(userId || user.userId);
                // Ensure that 'response.posts' is an array
                setUserPosts(Array.isArray(response.posts) ? response.posts : []);
            } catch (error) {
                logger.error('Error loading profile:', error);
                setUserPosts([]); // Fallback to empty array on error
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, user]); // Dependencies include userId and user

    if (loading) {
        return <div className="loading-spinner">Loading profile...</div>;
    }

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h1>Profile</h1>
                <div className="profile-subtitle">View and manage your profile information</div>
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

                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            {/* Show Edit and Settings only if viewing own profile */}
                            {(!userId || userId === user.userId) && (
                                <>
                                    <Button className="button button-edit">
                                        <FiEdit className="icon" />Edit Profile
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="user-card">
                        <div className="user-card-header">
                            <div className="initials-avatar">
                                {getInitials(profileUser.firstName, profileUser.lastName)}
                            </div>
                            <div className="user-info"></div>
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

                    {/* Placeholder for Recent Activity */}
                    <div className="activity-section">
                        <h3>
                            Recent Activity
                            <span className="section-action">View All</span>
                        </h3>
                        <div className="placeholder-content">
                            Activity timeline coming soon
                        </div>
                    </div>

                    {/* Updated to pass userPosts instead of user.posts */}
                    <div className="posts-section">
                        <h3>
                            <span><FiBook /> Recent Posts</span>
                            <span className="section-action">View All</span>
                        </h3>
                        {/* Pass posts array directly instead of wrapping in an object */}
                        <PostCard posts={userPosts} />
                    </div>

                    {/* Placeholder for Connections */}
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