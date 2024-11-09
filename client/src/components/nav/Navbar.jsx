import {
    fetchPostById,
    HamburgerMenu,
    Logger,
    NavbarButtons,
    PageInfo,
    usePrivateModalContext,
    UserDropdown,
    useUserUpdate,
    Button
} from '@components';
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        right: 0,
    });

    useEffect(() => {
        if (id) {
            fetchPostTitleAndExcerpt(id);
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchPostTitleAndExcerpt = async (postId) => {
        try {
            const post = await fetchPostById(postId);
            setPostTitle(post.title || "");
            setPostExcerpt(generateExcerpt(post.content));
            setLoading(false);
        } catch (error) {
            Logger.error("Error fetching post title and excerpt:", error);
            setLoading(false);
        }
    };

    const generateExcerpt = (content) => {
        const temp = document.createElement("div");
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText;
        const words = text.split(" ");
        return words.slice(0, 30).join(" ") + "...";
    };

    const getPageWelcomeText = () => {
        switch (location.pathname) {
            case "/":
                return {
                    title: "Welcome to Blogd.",
                    subtitle:
                        "Discover blogs that inspire and educate. Blow your mind, expand your horizons.",
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
    };

    const welcomeText = getPageWelcomeText();

    useEffect(() => {
        Logger.info("Navbar initialized");
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
        Logger.info("Logging out user");
        removeCookie("PassBloggs", { path: "/" });
        removeCookie("userID", { path: "/" });
        setUser(null);
        setTimeout(() => navigate("/login", { replace: true }), 1000);
    };

    const handleSidebarToggle = () => {
        toggleSidebar();
        setSidebarOpen(!sidebarOpen);
    };

    if (
        location.pathname === "/login" ||
        location.pathname === "/register"
    )
        return null;

    if (loading) return null;

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
                welcomeText={welcomeText}
                categories={categories}
                location={location}
            />
        </motion.header>
    );
};

export default Navbar;