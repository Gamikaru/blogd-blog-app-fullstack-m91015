// src/Providers.jsx

import {
    CommentProvider,
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
                <CommentProvider> {/* Add CommentProvider here */}
                    <PostProvider>
                        <PrivateModalProvider>{children}</PrivateModalProvider>
                    </PostProvider>
                </CommentProvider>
            </UserProvider>
        </PublicModalProvider>
    </NotificationProvider>
);

Providers.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Providers;