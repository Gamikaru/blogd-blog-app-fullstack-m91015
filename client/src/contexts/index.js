// src/contexts/index.js

export { NotificationContext, useNotificationContext } from './NotificationContext';
export { PostContext, usePostContext } from './PostContext';
export { PrivateModalContext, usePrivateModalContext } from './PrivateModalContext';
export { PublicModalContext, usePublicModalContext } from './PublicModalContext';
export { UserContext, useUser, useUserUpdate } from './UserContext';

// Export Providers separately to avoid duplication
export { NotificationProvider } from './NotificationContext';
export { PostProvider } from './PostContext';
export { PrivateModalProvider } from './PrivateModalContext';
export { PublicModalProvider } from './PublicModalContext';
export { UserProvider } from './UserContext';
