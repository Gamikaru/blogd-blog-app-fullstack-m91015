// src/Providers.jsx

import {
    NotificationProvider,
    PostProvider,
    PrivateModalProvider,
    PublicModalProvider,
    UserProvider,
} from '@contexts';

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

export default Providers;
