// UserManager.jsx
import { Button } from '@components';
import { useNotificationContext, useUser, useUserUpdate } from '@contexts';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiLock, FiMail, FiSettings, FiUser } from 'react-icons/fi';
import AccountTab from './AccountTab';
import NotificationsTab from './NotificationsTab';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';
import PropTypes from 'prop-types';


const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'account', label: 'Account', icon: <FiSettings /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FiMail /> }
];

const UserManager = ({ onClose }) => {
    const { user, loading } = useUser();
    const { setUser } = useUserUpdate();
    const { showNotification } = useNotificationContext();
    const [activeTab, setActiveTab] = useState('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                    />
                );
            case 'account':
                return (
                    <AccountTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                        // Pass setLoading if AccountTab requires it
                    />
                );
            case 'security':
                return (
                    <SecurityTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                        // Pass setLoading if SecurityTab requires it
                    />
                );
            case 'notifications':
                return (
                    <NotificationsTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                        // Pass setLoading if NotificationsTab requires it
                    />
                );
            default:
                return <div className="usermanager-content__coming-soon">Content coming soon.</div>;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="usermanager-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="usermanager-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                <motion.div
                    className="usermanager-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="usermanager-header">
                        <h2 className="usermanager-header__title">Settings</h2>
                        <Button
                            variant="close"
                            className="usermanager-header__close"
                            onClick={onClose}
                            showIcon={true}
                        />
                    </div>

                    <div className="usermanager-tabs">
                        {tabs.map(tab => (
                            <Button
                                key={tab.id}
                                className={`usermanager-tabs__button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                variant="noIcon"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    <div className="usermanager-content">
                        {renderTabContent()}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

UserManager.propTypes = {
    onClose: PropTypes.func.isRequired, // Declare that onClose is a required function prop
};

export default UserManager;
