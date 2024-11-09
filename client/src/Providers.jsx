import { NotificationProvider, PostProvider, PrivateModalProvider, PublicModalProvider, UserProvider } from '@components';
import React from 'react';

export const Providers = ({ children }) => (
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
