import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiBook, FiFilter, FiSearch } from 'react-icons/fi';
import Masonry from 'react-masonry-css';
import PostCard from './PostCard';

const searchInputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: '200px', opacity: 1 },
};

const filterDropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
};

const PostsSection = ({ userPosts, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput);
    };

    const filteredPosts = () => {
        let filtered = userPosts;

        if (activeTab === 'recent') {
            filtered = filtered
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10); // Example: latest 10 posts
        } else if (activeTab === 'all') {
            filtered = userPosts;
        } else if (activeTab === 'archived' || activeTab === 'favorites') {
            filtered = [];
        }

        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const renderContent = () => {
        if (activeTab === 'archived' || activeTab === 'favorites') {
            return <div className="posts-section__no-posts-message">Feature coming soon.</div>;
        }

        const posts = filteredPosts();

        return posts.length > 0 ? (
            <AnimatePresence mode="popLayout">
                <motion.div
                    className="posts-section__posts-container"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                        layout: { duration: 0.3 }
                    }}
                >
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="posts-section__posts-gallery"
                        columnClassName="posts-section__posts-gallery-column"
                    >
                        {posts.map((post) => (
                            <motion.div
                                key={post.postId || post._id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.2,
                                    layout: { duration: 0.3 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                            >
                                <PostCard
                                    post={post}
                                    isOwnProfile={isOwnProfile}
                                />
                            </motion.div>
                        ))}
                    </Masonry>
                </motion.div>
            </AnimatePresence>
        ) : (
            <div className="posts-section__no-posts-message">No posts available.</div>
        );
    };

    return (
        <div className="posts-section">
            <div className="posts-section__header">
                <h3 className="posts-section__title">
                    <FiBook /> Posts
                </h3>
                {isOwnProfile && (
                    <span
                        className="posts-section__action"
                        role="button"
                        tabIndex={0}
                        aria-label="View All Posts"
                        onClick={() => console.log('View All Posts clicked')}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                console.log('View All Posts clicked');
                            }
                        }}
                    >
                        View All
                    </span>
                )}
            </div>

            <div className="posts-section__tabs-and-controls">
                <div className="posts-section__tabs">
                    <button
                        className={`posts-section__tab ${activeTab === 'recent' ? 'posts-section__tab--active' : ''}`}
                        onClick={() => handleTabClick('recent')}
                    >
                        Recent
                    </button>
                    <button
                        className={`posts-section__tab ${activeTab === 'all' ? 'posts-section__tab--active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All
                    </button>
                    <button
                        className={`posts-section__tab ${activeTab === 'category' ? 'posts-section__tab--active' : ''}`}
                        onClick={() => handleTabClick('category')}
                    >
                        Categories
                    </button>
                    <button
                        className={`posts-section__tab ${activeTab === 'archived' ? 'posts-section__tab--active' : ''}`}
                        onClick={() => handleTabClick('archived')}
                    >
                        Archived
                    </button>
                    <button
                        className={`posts-section__tab ${activeTab === 'favorites' ? 'posts-section__tab--active' : ''}`}
                        onClick={() => handleTabClick('favorites')}
                    >
                        Favorites
                    </button>
                </div>
                <div className="posts-section__controls">
                    <div className="posts-section__filter-container">
                        <button
                            className="posts-section__filter-icon"
                            onClick={toggleFilter}
                            aria-label="Filter posts"
                        >
                            <FiFilter />
                        </button>
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    className="posts-section__filter-dropdown"
                                    variants={filterDropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    <p>Filter options coming soon.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="posts-section__search-container">
                        <button
                            className="posts-section__search-icon"
                            onClick={toggleSearchInput}
                            aria-label="Search posts"
                        >
                            <FiSearch />
                        </button>
                        <AnimatePresence>
                            {showSearchInput && (
                                <motion.input
                                    type="text"
                                    className="posts-section__search-input"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    variants={searchInputVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.3 }}
                                    aria-label="Search input"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

PostsSection.propTypes = {
    userPosts: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string,
            _id: PropTypes.string,
            content: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
            title: PropTypes.string,
            category: PropTypes.string,
            imageUrls: PropTypes.arrayOf(PropTypes.string),
            images: PropTypes.arrayOf(
                PropTypes.shape({
                    data: PropTypes.string.isRequired,
                })
            ),
            excerpt: PropTypes.string,
            isArchived: PropTypes.bool,
            isFavorite: PropTypes.bool,
        })
    ).isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
};

export default PostsSection;