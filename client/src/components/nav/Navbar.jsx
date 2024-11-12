import { HamburgerMenu, NavbarButtons, PageInfo, UserDropdown } from '@components';
import { usePrivateModalContext, useUserUpdate } from '@contexts';
import { fetchPostById } from '@services/api';
import { logger } from '@utils';
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const categories = [
    "Lifestyle",
    "Philosophy",
    "Productivity",
    "Health & Fitness",
    "Technology",
    "Cooking",
    "Art",
    "Music",
    "Business",
];

const Navbar = ({ toggleSidebar, toggleButtonRef }) => {
    const { togglePrivateModal } = usePrivateModalContext();
    const [, removeCookie] = useCookies();
    const location = useLocation();
    const navigate = useNavigate();
    const setUser = useUserUpdate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userIconRef = useRef(null);
    const { id } = useParams();

    const [postTitle, setPostTitle] = useState("");
    const [postExcerpt, setPostExcerpt] = useState("");
    const [loading, setLoading] = useState(!!id);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    // Memoized categories
    const memoizedCategories = useMemo(() => categories, []);

    // Function to fetch post data
    const fetchPostTitleAndExcerpt = useCallback(async (postId) => {
        try {
            const post = await fetchPostById(postId);
            setPostTitle(post.title || "");
            setPostExcerpt(generateExcerpt(post.content));
        } catch (error) {
            logger.error("Error fetching post title and excerpt:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect for fetching post data
    useEffect(() => {
        if (id) {
            fetchPostTitleAndExcerpt(id);
        }
    }, [id, fetchPostTitleAndExcerpt]);

    const generateExcerpt = useCallback((content) => {
        return content
            .replace(/<[^>]+>/g, '') // Strip HTML tags
            .split(/\s+/)
            .slice(0, 30)
            .join(" ") + "...";
    }, []);

    const getPageWelcomeText = useMemo(() => {
        switch (location.pathname) {
            case "/":
                return {
                    title: "Welcome to Blogd.",
                    subtitle: "Discover blogs that inspire and educate. Blow your mind, expand your horizons.",
                };
            case "/admin":
                return {
                    title: "Admin",
                    subtitle: "Manage users and content.",
                };
            case "/network":
                return {
                    title: "Network",
                    subtitle: "Connect and engage with others.",
                };
            default:
                return {
                    title: postTitle || "Explore our platform",
                    subtitle: postExcerpt || "",
                };
        }
    }, [location.pathname, postTitle, postExcerpt]);

    useEffect(() => {
        logger.info("Navbar initialized");
    }, []);

    useEffect(() => {
        if (showUserDropdown && userIconRef.current) {
            const rect = userIconRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
            });
        }
    }, [showUserDropdown]);

    const handleLogout = () => {
        logger.info("Logging out user");
        removeCookie("BlogdPass", { path: "/" });
        removeCookie("userID", { path: "/" });
        setUser(null);
        setTimeout(() => navigate("/login", { replace: true }), 1000);
    };

    const handleSidebarToggle = () => {
        toggleSidebar();
        setSidebarOpen((prev) => !prev);
    };

    if (["/login", "/register"].includes(location.pathname) || loading) return null;

    // Animation Variants
    const navbarVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
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
                        sidebarOpen={sidebarOpen}
                        handleSidebarToggle={handleSidebarToggle}
                        toggleButtonRef={toggleButtonRef}
                    />
                </div>

                <div className="navbar-right">
                    <NavbarButtons
                        togglePrivateModal={togglePrivateModal}
                        showUserDropdown={showUserDropdown}
                        setShowUserDropdown={setShowUserDropdown}
                    />
                    <UserDropdown
                        showDropdown={showUserDropdown}
                        setShowDropdown={setShowUserDropdown}
                        handleLogout={handleLogout}
                        position={dropdownPosition}
                        userIconRef={userIconRef}
                    />
                </div>
            </nav>

            <PageInfo
                welcomeText={getPageWelcomeText}
                categories={memoizedCategories}
                location={location}
            />
        </motion.header>
    );
};

export default Navbar;
