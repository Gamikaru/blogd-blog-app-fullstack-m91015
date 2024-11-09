// client/src/components/index.js

// Auth Components
export { default as LoginPage, default as RedirectIfLoggedIn } from './auth/LoginPage';

// Common Components
export { default as Button } from './common/Button';
export { default as CustomTagIcon } from './common/CustomTagIcon';
export { default as CustomToast } from './common/CustomToast';
export { default as ErrorBoundary } from './common/ErrorBoundary';
export { default as InputField } from './common/InputField';
export { default as Portal } from './common/Portal';
export { default as SelectField } from './common/SelectField';
export { default as Spinner } from './common/Spinner';

// Layout Components
export { default as AppLayout } from './layout/AppLayout';
export { default as PrivateRoute } from './layout/PrivateRoute';
export { default as PublicRoute } from './layout/PublicRoute';

// Modals
export { default as EditPostModal } from './modals/EditPostModal';
export { default as ModalManager } from './modals/ModalManager';
export { default as PostModal } from './modals/PostModal';
export { default as RegisterModal } from './modals/RegisterModal';
export { default as AccountTab } from './modals/user-manager/AccountTab';
export { default as NotificationsTab } from './modals/user-manager/NotificationsTab';
export { default as ProfileTab } from './modals/user-manager/ProfileTab';
export { default as SecurityTab } from './modals/user-manager/SecurityTab';
export { default as UserManager } from './modals/user-manager/UserManager';

// Navigation Components
export { default as HamburgerMenu } from './nav/HamburgerMenu';
export { default as Logo } from './nav/Logo';
export { default as Navbar } from './nav/Navbar';
export { default as NavbarButtons } from './nav/NavbarButtons';
export { default as PageInfo } from './nav/PageInfo';
export { default as Sidebar } from './nav/Sidebar';
export { default as UserDropdown } from './nav/UserDropdown';

// Page Components
export { default as Admin } from './pages/Admin';
export { default as Bloggs } from './pages/Bloggs';
// export { default as Comments } from './pages/Comments';
// export { default as ContentManager } from './pages/ContentManager';
// export { default as EditUser } from './pages/EditUser';
export { default as FullBlogView } from './pages/FullBlogView';
export { default as Carousel } from './pages/home/Carousel';
export { default as CubeSlider } from './pages/home/CubeSlider';
export { default as HomePage } from './pages/home/HomePage';
export { default as ImageSlide } from './pages/home/ImageSlide';
export { default as PostCard } from './pages/home/PostCard';
export { default as TextSlide } from './pages/home/TextSlide';
export { default as UserCard } from './pages/home/UserCard';
export { default as Network } from './pages/Network';
export { default as NetworkCard } from './pages/NetworkCard';
export { default as UserProfile } from './pages/UserProfile';

// Contexts
export { default as NotificationProvider, useNotificationContext } from '../contexts/NotificationContext';
export { default as PostProvider, usePostContext } from '../contexts/PostContext';
export { default as PrivateModalProvider, usePrivateModalContext } from '../contexts/PrivateModalContext';
export { default as PublicModalProvider, usePublicModalContext } from '../contexts/PublicModalContext';
export { default as UserProvider, useUser, useUserUpdate } from '../contexts/UserContext';

// Services
export { default as ApiClient } from '../services/api/ApiClient';
export { fetchTrendingArticles } from '../services/api/newsService';
export { createPost, deletePostById, fetchAllPosts, fetchPostById, fetchPostsByUser, fetchTopLikedPosts, likePost, unlikePost, updatePostById } from '../services/api/PostService';
export { default as UserService } from '../services/api/UserService';

// Utils
export { capitalizeFirstLetter, validateLoginForm, validatePostContent, validateRegForm } from '../utils/formValidation';
export { default as Logger } from '../utils/Logger';
export { default as sanitizeContent } from '../utils/sanitizeContent';
export { calculateReadingTime, countWords } from '../utils/textAnalytics';

