//BlogsSection.jsx
// Desc: Blogs section component

import { Button, CustomTagIcon, fetchAllPosts, Logger, sanitizeContent, Spinner, useUser } from '@components';
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FaFilter, FaHeart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Bloggs() {
    const [cookie] = useCookies();
    const { user } = useUser();
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const filterRef = useRef(null);
    const searchRef = useRef(null);
    const [filters, setFilters] = useState({
        author: "",
        category: "",
        sortBy: "",
    });
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        Logger.info("Component mounted, fetching all blog posts...");
        fetchAllBlogPosts();
    }, []);

    const fetchAllBlogPosts = async () => {
        try {
            const posts = await fetchAllPosts();
            const sanitizedPosts = posts.map(post => ({
                ...post,
                content: sanitizeContent(post.content)
            }));
            setBlogPosts(sanitizedPosts);
            setLoading(false);
        } catch (error) {
            Logger.error("Error fetching blog posts:", error);
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const post = blogPosts.find((post) => post._id === postId);
            const alreadyLiked = post.likesBy?.includes(cookie.userID);
            // Handle like/unlike logic
        } catch (error) {
            Logger.error("Error liking post:", error);
        }
    };

    const author = (post) =>
        post.userId
            ? `${post.userId.firstName} ${post.userId.lastName}`
            : "Unknown Author";

    const truncateContent = (content) => {
        const temp = document.createElement('div');
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText || "";
        return text.length > 100 ? text.substring(0, 100) + "..." : text;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilterDropdown(false);
        }
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowSearchInput(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredPosts = blogPosts.filter((post) => {
        const matchesAuthor = filters.author
            ? author(post).toLowerCase().includes(filters.author.toLowerCase())
            : true;
        const matchesCategory = filters.category
            ? post.category === filters.category
            : true;
        const matchesSearch = search
            ? post.title.toLowerCase().includes(search.toLowerCase()) ||
            author(post).toLowerCase().includes(search.toLowerCase())
            : true;
        return matchesAuthor && matchesCategory && matchesSearch;
    });

    const sortedPosts = filteredPosts.sort((a, b) => {
        if (filters.sortBy === "name") {
            return author(a).localeCompare(author(b));
        } else if (filters.sortBy === "title") {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    };

    const hoverVariants = {
        hover: {
            scale: 1.02,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        },
    };

    const likeButtonVariants = {
        tap: { scale: 0.9 },
    };

    const searchInputVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: { width: '200px', opacity: 1 },
    };

    const filterDropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <div className="bloggs-container">
            {loading ? (
                <Spinner message="Loading blog posts..." />
            ) : (
                <>
                    <div className="filter-search-container">
                        <div className="search-container" ref={searchRef}>
                            <Button
                                className="search-icon"
                                onClick={() => setShowSearchInput(!showSearchInput)}
                                variant="icon"
                            >
                                <FaSearch />
                            </Button>
                            <AnimatePresence>
                                {showSearchInput && (
                                    <motion.input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search by author or title"
                                        value={search}
                                        onChange={handleSearchChange}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={searchInputVariants}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="filter-container" ref={filterRef}>
                            <Button
                                className="filter-icon"
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                variant="icon"
                            >
                                <FaFilter />
                            </Button>
                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <motion.div
                                        className="filter-dropdown"
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="filter-option">
                                            <label htmlFor="author">Author:</label>
                                            <input
                                                type="text"
                                                id="author"
                                                name="author"
                                                value={filters.author}
                                                onChange={handleFilterChange}
                                            />
                                        </div>
                                        <div className="filter-option">
                                            <label htmlFor="category">Category:</label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={filters.category}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">All</option>
                                                <option value="Health and Fitness">Health and Fitness</option>
                                                <option value="Lifestyle">Lifestyle</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Cooking">Cooking</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="filter-option">
                                            <label htmlFor="sortBy">Sort By:</label>
                                            <select
                                                id="sortBy"
                                                name="sortBy"
                                                value={filters.sortBy}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">None</option>
                                                <option value="name">Author Name</option>
                                                <option value="title">Title</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <AnimatePresence>
                        <LayoutGroup>
                            <motion.div
                                className="blog-posts-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                layout
                            >
                                {sortedPosts.length > 0 ? (
                                    sortedPosts.map((post) => (
                                        <motion.div
                                            className="blog-post-card"
                                            key={post._id}
                                            variants={cardVariants}
                                            whileHover="hover"
                                            onClick={() => navigate(`/blog/${post._id}`)}
                                            layout
                                        >
                                            {post.imageUrls && post.imageUrls.length > 0 && (
                                                <img
                                                    src={post.imageUrls[0]}
                                                    alt="Blog cover"
                                                    className="blog-cover-image"
                                                    loading="lazy"
                                                />
                                            )}
                                            {post.images && post.images.length > 0 && (
                                                <img
                                                    src={`data:image/jpeg;base64,${post.images[0].data}`}
                                                    alt="Blog cover"
                                                    className="blog-cover-image"
                                                    loading="lazy"
                                                />
                                            )}
                                            <div className="post-header">
                                                <span className="author-name">{author(post)}</span>
                                                <span className="post-date">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h2 className="post-title">{post.title || ""}</h2>
                                            <div className="post-category">
                                                <CustomTagIcon className="category-icon" text={post.category} />
                                            </div>
                                            <div
                                                className="post-content"
                                                dangerouslySetInnerHTML={{ __html: truncateContent(post.content) }}
                                            />
                                            <div className="post-interactions">
                                                <Button
                                                    className="button button-submit like-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(post._id);
                                                    }}
                                                    aria-label={
                                                        post.likesBy?.includes(cookie.userID) ? "Unlike" : "Like"
                                                    }
                                                    variant="noIcon"
                                                >
                                                    <motion.span
                                                        className={`heart-icon ${post.likesBy?.includes(cookie.userID) ? "liked" : ""
                                                            }`}
                                                        whileTap="tap"
                                                        variants={likeButtonVariants}
                                                    >
                                                        <FaHeart />
                                                    </motion.span>
                                                    <span className="likes-count">{post.likes}</span>
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="no-posts-message">No blog posts available.</p>
                                )}
                            </motion.div>
                        </LayoutGroup>
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};