// components/pages/profile/QuickActions.jsx

import { Button } from '@components';
import PropTypes from 'prop-types';
import { FiEdit } from 'react-icons/fi';

const QuickActions = ({ isOwnProfile }) => {
    return (
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
    );
};

QuickActions.propTypes = {
    isOwnProfile: PropTypes.bool.isRequired,
};

export default QuickActions;
