// src/Providers.jsx

import {
    CommentProvider,
    NotificationProvider,
    PostProvider,
    PrivateModalProvider,
    PublicModalProvider,
    ThemeProvider,
    UserProvider,
} from '@contexts';
import PropTypes from 'prop-types';

const Providers = ({ children }) => (
    <ThemeProvider>
        <NotificationProvider>
            <PublicModalProvider>
                <UserProvider>
                    <CommentProvider>
                        <PostProvider>
                            <PrivateModalProvider>{children}</PrivateModalProvider>
                        </PostProvider>
                    </CommentProvider>
                </UserProvider>
            </PublicModalProvider>
        </NotificationProvider>
    </ThemeProvider>
);

Providers.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Providers;