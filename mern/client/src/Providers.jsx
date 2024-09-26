import React from 'react';
import { NotificationProvider, PostProvider, PrivateModalProvider, PublicModalProvider, UserProvider } from './contexts';

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
