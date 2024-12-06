// src/components/BlogCard.jsx
import { LazyImage } from '@components';
import { useUser } from '@contexts/UserContext';
import logger from '@utils/logger';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
    hover: {
        scale: 1.01,
        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
};

const BlogCard = memo(function BlogCard({ post, author }) {
    const navigate = useNavigate();
    const { user } = useUser();

    const userId = user?.userId || user?._id;
    logger.info(
        `BlogCard Rendered: postId=${post.postId}, userId=${userId}, likesBy=${JSON.stringify(
            post.likesBy
        )}`
    );

    const navigateToPost = useCallback(
        () => navigate(`/blog/${post.postId || post._id}`),
        [navigate, post]
    );

    return (
        <motion.div
            className="blog-post-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            layout
            onClick={navigateToPost}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter') navigateToPost();
            }}
            aria-label={`Go to blog post titled ${post.title || 'Untitled'}`}
        >
            <div className="blog-post-card__image-container">
                {post.imageUrls?.length ? (
                    <LazyImage
                        src={post.imageUrls[0]}
                        alt={`Cover image for ${post.title || 'Untitled'}`}
                        className="blog-post-card__image-container__cover-image"
                    />
                ) : post.images?.length ? (
                    <LazyImage
                        src={`data:image/jpeg;base64,${post.images[0].data}`}
                        alt={`Cover image for ${post.title || 'Untitled'}`}
                        className="blog-post-card__image-container__cover-image"
                    />
                ) : (
                    <div
                        className="blog-post-card__image-container__cover-placeholder"
                        aria-label="No cover image available"
                    >
                        No Image
                    </div>
                )}
            </div>

            <div className="blog-post-card__content">
                <div className="blog-post-card__content__header">
                    <span className="blog-post-card__content__header__author-name">{author}</span>
                    <span className="blog-post-card__content__header__post-date">
                        {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : 'Unknown Date'}
                    </span>
                </div>

                <h2 className="blog-post-card__content__title">
                    {post.title || 'Untitled'}
                </h2>

                {post.category && (
                    <div className="blog-post-card__content__category">
                        <span
                            className={`blog-post-card__content__category-tag ${post.category?.toLowerCase() || 'default'}-category`}
                        >
                            {post.category}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
});

BlogCard.displayName = 'BlogCard';

BlogCard.propTypes = {
    post: PropTypes.shape({
        postId: PropTypes.string,
        _id: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        userId: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
        }).isRequired,
        title: PropTypes.string,
        excerpt: PropTypes.string,
        content: PropTypes.string.isRequired,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                data: PropTypes.string.isRequired,
            })
        ),
        likesBy: PropTypes.arrayOf(PropTypes.string),
        likes: PropTypes.number.isRequired,
        category: PropTypes.string,
    }).isRequired,
    author: PropTypes.string.isRequired,
};

export default BlogCard;