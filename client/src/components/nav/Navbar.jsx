// src/components/nav/Navbar.jsx
import { HamburgerMenu, NavbarButtons, PageInfo, UserDropdown } from '@components';
import { usePrivateModalContext, useUser, useUserUpdate } from '@contexts';
import { fetchPostById } from '@services/api';
import { logger } from '@utils';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ensure correct import

const categories = [
    'Lifestyle',
    'Philosophy',
    'Productivity',
    'Health & Fitness',
    'Technology',
    'Cooking',
    'Art',
    'Music',
    'Business',
];

const Navbar = React.memo(() => {
    const { togglePrivateModal } = usePrivateModalContext();
    const [, removeCookie] = useCookies();
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useUserUpdate();
    const { user } = useUser();
    const { userId: profileUserId } = useParams();
    const [profileUserName, setProfileUserName] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userIconRef = useRef(null);

    // Create a ref for HamburgerMenu
    const hamburgerRef = useRef(null);

    // Extract postId from URL
    const postId = useMemo(() => {
        const match = location.pathname.match(/\/blog\/([^\/]+)/);
        return match ? match[1] : null;
    }, [location.pathname]);

    const [postTitle, setPostTitle] = useState('');
    const [postExcerpt, setPostExcerpt] = useState('');
    const [loading, setLoading] = useState(!!postId);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    const memoizedCategories = useMemo(() => categories, []);

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
        []
    );

    const generateExcerpt = useCallback(
        (content) => {
            return (
                content
                    .replace(/<[^>]+>/g, '')
                    .split(/\s+/)
                    .slice(0, 30)
                    .join(' ') + '...'
            );
        },
        []
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

    useEffect(() => {
        const fetchProfileUserName = async () => {
            if (isProfilePage) {
                try {
                    let profileUser;
                    if (profileUserId && profileUserId !== user.userId) {
                        profileUser = await UserService.fetchUserById(profileUserId);
                        setProfileUserName(`${profileUser.firstName} ${profileUser.lastName}`);
                    } else {
                        // Viewing own profile
                        setProfileUserName(`${user.firstName} ${user.lastName}`);
                    }
                } catch (error) {
                    logger.error('Error fetching profile user:', error);
                    setProfileUserName('User');
                }
            }
        };

        fetchProfileUserName();
    }, [isProfilePage, profileUserId, user]);

    const getPageWelcomeText = useMemo(() => {
        if (isProfilePage) {
            const isOwnProfile = !profileUserId || profileUserId === user.userId;
            return {
                title: isOwnProfile ? 'Your Profile' : `${profileUserName}'s Profile`,
                subtitle: isOwnProfile
                    ? 'Manage your profile information'
                    : `Viewing ${profileUserName}'s profile`,
            };
        }

        switch (location.pathname) {
            case '/':
                return {
                    title: 'Welcome to Blogd.',
                    subtitle:
                        'Discover blogs that inspire and educate. Blow your mind, expand your horizons.',
                };
            case '/admin':
                return {
                    title: 'Admin',
                    subtitle: 'Manage users and content.',
                };
            case '/network':
                return {
                    title: 'Network',
                    subtitle:
                        'Connect and engage with others.',
                };
            default:
                return {
                    title:
                        postTitle ||
                        'Explore our platform',
                    subtitle:
                        postExcerpt || '',
                };
        }
    }, [location.pathname, postTitle, postExcerpt, isProfilePage, profileUserId, profileUserName, user]);

    useEffect(() => {
        if (
            showUserDropdown &&
            userIconRef.current
        ) {
            const rect =
                userIconRef.current.getBoundingClientRect();
            setDropdownPosition({
                top:
                    rect.bottom +
                    window.scrollY,
                right:
                    window.innerWidth -
                    rect.right,
            });
        }
    }, [showUserDropdown]);

    const handleLogout = useCallback(() => {
        logger.info('Logging out user');
        removeCookie('BlogdPass', { path: '/' });
        removeCookie('userId', { path: '/' });
        setUser(null);
        setTimeout(
            () =>
                navigate('/login', {
                    replace: true,
                }),
            1000
        );
    }, [removeCookie, setUser, navigate]);

    // Define toggle and close functions
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    if (
        ['/login', '/register'].includes(
            location.pathname
        ) ||
        loading
    )
        return null;

    const navbarVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <motion.header
                className="nav-header"
                variants={navbarVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
            >
                <nav className="navbar">
                    <div className="navbar-left">
                        <HamburgerMenu
                            ref={hamburgerRef} // Attach ref
                            isOpen={sidebarOpen}
                            handleSidebarToggle={
                                handleSidebarToggle
                            }
                        />
                    </div>

                    <div className="navbar-right">
                        <NavbarButtons
                            togglePrivateModal={
                                togglePrivateModal
                            }
                            showUserDropdown={
                                showUserDropdown
                            }
                            setShowUserDropdown={
                                setShowUserDropdown
                            }
                        />
                        <UserDropdown
                            showDropdown={
                                showUserDropdown
                            }
                            setShowDropdown={
                                setShowUserDropdown
                            }
                            handleLogout={handleLogout}
                            position={
                                dropdownPosition
                            }
                            userIconRef={userIconRef}
                        />
                    </div>
                </nav>

                <PageInfo
                    welcomeText={
                        getPageWelcomeText
                    }
                    categories={
                        memoizedCategories
                    }
                    location={location}
                />
            </motion.header>

            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={handleSidebarToggle}
                handleSidebarClose={handleSidebarClose} // Pass close function
                hamburgerRef={hamburgerRef} // Pass ref to Sidebar
            />
        </>
    );
});

export default Navbar;