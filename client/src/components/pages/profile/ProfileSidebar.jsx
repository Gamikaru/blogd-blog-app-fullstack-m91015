// components/pages/profile/ProfileSidebar.jsx

import PropTypes from 'prop-types';
import QuickActions from './QuickActions';
import StatsCard from './StatsCard';
import UserCard from './UserCard';

const ProfileSidebar = ({ profileUser, userPosts, isOwnProfile }) => {
    return (
        <div className="profile-sidebar">
            <div className="profile-sidebar__sidebar-columns">
                <UserCard profileUser={profileUser} />
                <StatsCard userPosts={userPosts} />
            </div>
            <QuickActions isOwnProfile={isOwnProfile} />
        </div>
    );
};

ProfileSidebar.propTypes = {
    profileUser: PropTypes.shape({
        // name: PropTypes.string.isRequired,
        // role: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
        location: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    userPosts: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string,
            _id: PropTypes.string,
            content: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
        })
    ).isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
};

export default ProfileSidebar;