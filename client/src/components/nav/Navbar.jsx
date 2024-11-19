// src/components/nav/Navbar.jsx
import {
    HamburgerMenu,
    Logo,
    NavbarButtons,
    PageInfo,
    Sidebar,
    UserDropdown
} from '@components';
import { usePrivateModalContext, useUser, useUserUpdate } from '@contexts';
import { fetchPostById } from '@services/api';
import { logger } from '@utils';
import { useAnimation } from 'framer-motion';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categories';

const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
    const { togglePrivateModal } = usePrivateModalContext();
    const [, removeCookie] = useCookies();
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useUserUpdate();
    const { user } = useUser();

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userIconRef = useRef(null);
    const hamburgerRef = useRef(null);

    // Animation Controls
    const controls = useAnimation();

    // Trigger animation on mount only
    useEffect(() => {
        controls.start('visible');
    }, [controls]);

    // Extract postId from URL
    const postId = useMemo(() => {
        const match = location.pathname.match(/\/blog\/([^/]+)/);
        return match ? match[1] : null;
    }, [location.pathname]);

    const [postTitle, setPostTitle] = useState('');
    const [postExcerpt, setPostExcerpt] = useState('');
    const [loading, setLoading] = useState(!!postId);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    const memoizedCategories = useMemo(() => CATEGORIES, []);

    const generateExcerpt = useCallback((content) => {
        return (
            content
                .replace(/<[^>]+>/g, '')
                .split(/\s+/)
                .slice(0, 30)
                .join(' ') + '...'
        );
    }, []);

    const fetchPostTitleAndExcerpt = useCallback(
        async (postId) => {
            try {
                const post = await fetchPostById(postId);
                setPostTitle(post.title || '');
                setPostExcerpt(generateExcerpt(post.content));
            } catch (error) {
                logger.error('Error fetching post title and excerpt:', error);
            } finally {
                setLoading(false);
            }
        },
        [generateExcerpt]
    );

    useEffect(() => {
        if (postId) {
            fetchPostTitleAndExcerpt(postId);
        }
    }, [postId, fetchPostTitleAndExcerpt]);

    const isProfilePage = useMemo(
        () => location.pathname.startsWith('/profile'),
        [location.pathname]
    );

    const getPageWelcomeText = useMemo(() => {
        if (isProfilePage) {
            // Profile-specific welcome text is handled by ProfileHeader
            return null;
        }

        switch (location.pathname) {
            case '/':
                return {
                    title: 'Welcome to Blogd.',
                    subtitle:
                        'Discover blogs that inspire and educate. Blow your mind, expand your horizons.',
                };
            case '/network':
                return {
                    title: 'Network',
                    subtitle: 'Connect and engage with others.',
                };
            default:
                return {
                    title: postTitle || 'Explore our platform',
                    subtitle: postExcerpt || '',
                };
        }
    }, [location.pathname, postTitle, postExcerpt, isProfilePage]);

    useEffect(() => {
        if (showUserDropdown && userIconRef.current) {
            const rect = userIconRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
            });
        }
    }, [showUserDropdown]);

    const handleLogout = useCallback(() => {
        logger.info('Logging out user');
        removeCookie('BlogdPass', { path: '/' });
        removeCookie('userId', { path: '/' });
        setUser(null);
        navigate('/login', { replace: true });
    }, [removeCookie, setUser, navigate]);

    // Sidebar State and Handlers
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Close Navbar dropdown when Sidebar is opened
    useEffect(() => {
        if (sidebarOpen) {
            setShowUserDropdown(false);
        }
    }, [sidebarOpen]);

    if (['/login', '/register'].includes(location.pathname) || loading) return null;

    return (
        <>
            <header
                className="nav-header"
                variants={navbarVariants}
                initial="hidden"
                animate={controls}
                transition={{ duration: 0.5 }}
            >
                <nav className="navbar">
                    <div className="navbar-left">
                        <Logo />
                        <HamburgerMenu
                            ref={hamburgerRef}
                            isOpen={sidebarOpen}
                            handleSidebarToggle={handleSidebarToggle}
                        />
                    </div>

                    <div className="navbar-right">
                        <NavbarButtons
                            togglePrivateModal={togglePrivateModal}
                            setShowUserDropdown={setShowUserDropdown}
                        />
                        <UserDropdown
                            user={user} // Pass 'user' to UserDropdown for avatar display
                            showDropdown={showUserDropdown}
                            setShowDropdown={setShowUserDropdown}
                            handleLogout={handleLogout}
                            position={dropdownPosition}
                            userIconRef={userIconRef}
                        />
                    </div>
                </nav>

                {/* Conditionally render PageInfo */}
                {getPageWelcomeText && (
                    <PageInfo
                        welcomeText={getPageWelcomeText}
                        categories={memoizedCategories}
                        location={location}
                    />
                )}
            </header>

            <Sidebar
                sidebarOpen={sidebarOpen}
                handleSidebarClose={handleSidebarClose}
                hamburgerRef={hamburgerRef}
            />
        </>
    );
};

Navbar.displayName = 'Navbar';

export default React.memo(Navbar);