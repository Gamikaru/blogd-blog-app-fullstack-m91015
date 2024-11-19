// components/pages/profile/QuickActions.jsx

import { Button } from '@components';
import PropTypes from 'prop-types';
import { FiEdit } from 'react-icons/fi';

const QuickActions = ({ isOwnProfile }) => {
    return (
        <div className="quick-actions">
            <h3 className="quick-actions__title">Quick Actions</h3>
            <div className="quick-actions__action-buttons">
                {isOwnProfile && (
                    <Button className="quick-actions__button quick-actions__button--edit">
                        <FiEdit className="quick-actions__icon" />Edit Profile
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