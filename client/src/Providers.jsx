// src/Providers.jsx

import {
    NotificationProvider,
    PostProvider,
    PrivateModalProvider,
    PublicModalProvider,
    UserProvider,
} from '@contexts'; // Adjust the import path if necessary

const Providers = ({ children }) => (
    <PublicModalProvider>
        <UserProvider>
            <PostProvider>
                <PrivateModalProvider>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </PrivateModalProvider>
            </PostProvider>
        </UserProvider>
    </PublicModalProvider>
);

export default Providers;
