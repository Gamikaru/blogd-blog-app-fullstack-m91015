// UserManager.jsx
import { useNotificationContext, useUser, useUserUpdate } from '@contexts';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiLock, FiMail, FiSettings, FiUser } from 'react-icons/fi';
import AccountTab from './AccountTab';
import NotificationsTab from './NotificationsTab';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';

const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'account', label: 'Account', icon: <FiSettings /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FiMail /> },
];

const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

const UserManager = ({ onClose }) => {
    const { user, loading } = useUser();
    const { setUser } = useUserUpdate();
    const { showNotification } = useNotificationContext();
    const [activeTab, setActiveTab] = useState('profile');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const renderTabContent = () => {
        let ContentComponent;

        switch (activeTab) {
            case 'profile':
                ContentComponent = (
                    <ProfileTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                    />
                );
                break;
            case 'account':
                ContentComponent = (
                    <AccountTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                    />
                );
                break;
            case 'security':
                ContentComponent = (
                    <SecurityTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                    />
                );
                break;
            case 'notifications':
                ContentComponent = (
                    <NotificationsTab
                        user={user}
                        setUser={setUser}
                        showNotification={showNotification}
                        loading={loading}
                    />
                );
                break;
            default:
                ContentComponent = (
                    <div className="user-manager__no-content-message">
                        Content coming soon.
                    </div>
                );
                break;
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="user-manager__tab-content"
                >
                    {ContentComponent}
                </motion.div>
            </AnimatePresence>
        );
    };



    return (
        <AnimatePresence>
            <motion.div
                className="user-manager"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="user-manager__backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                <motion.div
                    className="user-manager__container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="user-manager__header">
                        <h2 className="user-manager__title">Settings</h2>
                        <button
                            className="user-manager__close-button"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="user-manager__tabs-and-controls">
                        <div className="user-manager__tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`user-manager__tab ${activeTab === tab.id ? 'user-manager__tab--active' : ''
                                        }`}
                                    onClick={() => handleTabClick(tab.id)}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="user-manager__content">{renderTabContent()}</div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

UserManager.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default UserManager;