// src/components/BlogsContainer.jsx

import { Button, InputField, SelectField, Spinner } from '@components';
import { usePostContext } from '@contexts';
import { logger } from '@utils';
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import BlogCard from './BlogCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const searchInputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: '200px', opacity: 1 },
};

const filterDropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
};

const BlogsContainer = () => {
    const { posts, loading, loadPosts } = usePostContext();
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        sortBy: "",
    });
    const [searchInput, setSearchInput] = useState(""); // Immediate input value
    const [search, setSearch] = useState(""); // Debounced search value

    const filterRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        logger.info("Fetching blog posts...");
        loadPosts();
    }, [loadPosts]);

    const getAuthor = useCallback((post) => {
        if (!post?.userId) return "Unknown Author";
        const { firstName = '', lastName = '' } = post.userId;
        return `${firstName} ${lastName}`.trim();
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Debounce the search input to update the 'search' state
    const debouncedSetSearch = useMemo(
        () => debounce((value) => setSearch(value), 300),
        []
    );

    const handleSearchInputChange = useCallback((value) => {
        setSearchInput(value);
        debouncedSetSearch(value);
    }, [debouncedSetSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchInput(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        const searchLower = search.toLowerCase();

        logger.info('Filtering posts:', {
            totalPosts: posts.length,
            filters,
            search: searchLower
        });

        const filtered = posts.filter((post) => {
            const postAuthor = getAuthor(post).toLowerCase();
            const matchesCategory = !filters.category ||
                post.category === filters.category;
            const matchesSearch = !search ||
                (post.title?.toLowerCase().includes(searchLower) ||
                    post.content?.toLowerCase().includes(searchLower) ||
                    postAuthor.includes(searchLower));

            logger.debug('Post filter results:', {
                postId: post._id,
                author: postAuthor,
                category: post.category,
                matchesCategory,
                matchesSearch
            });

            return matchesCategory && matchesSearch;
        });

        logger.info('Filtered results:', {
            filteredCount: filtered.length
        });

        return filtered;
    }, [posts, filters, search, getAuthor]);

    const sortedPosts = useMemo(() => {
        const sorted = [...filteredPosts];
        switch (filters.sortBy) {
            case "author-asc":
                sorted.sort((a, b) => getAuthor(a).localeCompare(getAuthor(b)));
                break;
            case "author-desc":
                sorted.sort((a, b) => getAuthor(b).localeCompare(getAuthor(a)));
                break;
            case "title-asc":
                sorted.sort((a, b) => a.title?.localeCompare(b.title) || 0);
                break;
            case "title-desc":
                sorted.sort((a, b) => b.title?.localeCompare(a.title) || 0);
                break;
            case "date-asc":
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "date-desc":
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }
        return sorted;
    }, [filteredPosts, filters.sortBy, getAuthor]);

    const resetFilters = useCallback(() => {
        setFilters({
            category: "",
            sortBy: "",
        });
        setSearch("");
        setSearchInput("");
    }, []);

    if (loading) return <Spinner message="Loading blog posts..." />;
    if (!posts) return <div className="blogs-container__no-posts-message">No posts available</div>;

    return (
        <div className="blogs-container">
            {/* Title and Subtitle Section */}
            <div className="blogs-container__header">
                <h1 className="blogs-container__title">Discover</h1>
                <p className="blogs-container__subtitle">
                    Explore the best blogs crafted by creative minds around the world. Search, filter, and dive into stories that inspire.
                </p>
            </div>
            <div className="blogs-container__filter-search-container">
                {/* Filter Functionality */}
                <div className="blogs-container__filter-container" ref={filterRef}>
                    <Button
                        className="blogs-container__icon"
                        onClick={() => setShowFilterDropdown((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Filter"
                    >
                        <FaFilter />
                    </Button>
                    <AnimatePresence>
                        {showFilterDropdown && (
                            <motion.div
                                className="blogs-container__dropdown"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={filterDropdownVariants}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {/* Category Filter */}
                                <div className="blogs-container__option">
                                    <label htmlFor="category">Category:</label>
                                    <SelectField
                                        name="category"
                                        options={[
                                            "Health and Fitness",
                                            "Lifestyle",
                                            "Technology",
                                            "Cooking",
                                            "Philosophy",
                                            "Productivity",
                                            "Art",
                                            "Music",
                                            "Business",
                                            "Business & Finance",
                                            "Other"
                                        ]}
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="blogs-container__select"
                                        aria-label="Filter by category"
                                    />
                                </div>
                                {/* Sort By Filter */}
                                <div className="blogs-container__option">
                                    <label htmlFor="sortBy">Sort By:</label>
                                    <SelectField
                                        name="sortBy"
                                        options={[
                                            { label: "None", value: "" },
                                            { label: "Author Name (A-Z)", value: "author-asc" },
                                            { label: "Author Name (Z-A)", value: "author-desc" },
                                            { label: "Title (A-Z)", value: "title-asc" },
                                            { label: "Title (Z-A)", value: "title-desc" },
                                            { label: "Date (Oldest First)", value: "date-asc" },
                                            { label: "Date (Newest First)", value: "date-desc" },
                                        ]}
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                        className="blogs-container__select"
                                        aria-label="Sort posts"
                                    />
                                </div>
                                {/* Reset Filters Button */}
                                <div className="blogs-container__option blogs-container__option--actions">
                                    <Button
                                        onClick={resetFilters}
                                        variant="reset"
                                        aria-label="Reset Filters"
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="blogs-container__search-container" ref={searchRef}>
                    <Button
                        className="blogs-container__icon"
                        onClick={() => setShowSearchInput((prev) => !prev)}
                        variant="iconButton"
                        aria-label="Search"
                    >
                        <FaSearch />
                    </Button>

                    <AnimatePresence>
                        {showSearchInput && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={searchInputVariants}
                                transition={{ duration: 0.3 }}
                                className="blogs-container__search-input-wrapper"
                            >
                                <InputField
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => handleSearchInputChange(e.target.value)}
                                    placeholder="Search by author, title, or content"
                                    aria-label="Search input"
                                    className="blogs-container__search-input"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <AnimatePresence>
                <LayoutGroup>
                    <motion.div
                        className="blogs-container__posts-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                    >
                        {sortedPosts.length > 0 ? (
                            sortedPosts.map((post) => (
                                <BlogCard
                                    key={post.postId || post._id}
                                    post={post}
                                    author={getAuthor(post)}
                                />
                            ))
                        ) : (
                            <p className="blogs-container__no-posts-message">No blog posts available.</p>
                        )}
                    </motion.div>
                </LayoutGroup>
            </AnimatePresence>
        </div>
    );

};

export default BlogsContainer;