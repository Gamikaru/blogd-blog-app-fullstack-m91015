// src/Providers.jsx

import {
    NotificationProvider,
    PostProvider,
    PrivateModalProvider,
    PublicModalProvider,
    UserProvider,
} from '@contexts';

import PropTypes from 'prop-types';



const Providers = ({ children }) => (
    <NotificationProvider>
        <PublicModalProvider>
            <UserProvider>
                <PostProvider>
                    <PrivateModalProvider>{children}</PrivateModalProvider>
                </PostProvider>
            </UserProvider>
        </PublicModalProvider>
    </NotificationProvider>
);

Providers.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Providers;