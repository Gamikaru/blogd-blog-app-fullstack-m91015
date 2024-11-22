import { Button, CustomTagIcon, LazyImage } from '@components';
import { usePostContext } from '@contexts/PostContext';
import { useUser } from '@contexts/UserContext';
import logger from '@utils/logger'; // Ensure logger is imported
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
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
        scale: 1.02,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    },
};

const BlogCard = memo(function BlogCard({ post, author }) {
    const navigate = useNavigate();
    const { like, unlike } = usePostContext();
    const { user } = useUser();

    const userId = user?.userId || user?._id;

    // Log userId and post.likesBy
    logger.info(`BlogCard Rendered: postId=${post.postId}, userId=${userId}, likesBy=${JSON.stringify(post.likesBy)}`);

    const handleLikeClick = useCallback(
        async (e) => {
            e.stopPropagation();
            if (!userId) {
                console.warn('User not authenticated');
                return;
            }
            const postId = post.postId || post._id;
            if (post.likesBy?.includes(userId)) {
                await unlike(postId);
            } else {
                await like(postId);
            }
        },
        [post, userId, like, unlike]
    );

    const navigateToPost = useCallback(() => navigate(`/blog/${post.postId || post._id}`), [
        navigate,
        post,
    ]);

    const isLiked = userId && post.likesBy?.includes(userId);

    // Log isLiked state
    logger.info(`isLiked for postId=${post.postId}: ${isLiked}`);

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
                    <div className="blog-post-card__image-container__cover-placeholder" aria-label="No cover image available">
                        No Image
                    </div>
                )}
            </div>

            <div className="blog-post-card__content">
                <div className="blog-post-card__content__header">
                    <span className="blog-post-card__content__header__author-name">{author}</span>
                    <span className="blog-post-card__content__header__post-date">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}
                    </span>
                </div>

                <div className="blog-post-card__content__title-category">
                    <h2 className="blog-post-card__content__title-category__title">{post.title || 'Untitled'}</h2>
                    <div className="blog-post-card__content__title-category__category">
                        {post.category ? (
                            <CustomTagIcon className="blog-post-card__content__title-category__category__icon" text={post.category} />
                        ) : (
                            <span className="blog-post-card__content__title-category__category__text"></span>
                        )}
                    </div>
                </div>

                <div className="blog-post-card__content__interactions">
                    <Button
                        onClick={handleLikeClick}
                        variant="iconButton"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                        filled={isLiked}
                    >
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {isLiked ? <FaHeart /> : <FiHeart />}
                        </motion.div>
                    </Button>
                    <span className="blog-post-card__content__interactions__like-button__likes-count">{post.likes}</span>
                </div>
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