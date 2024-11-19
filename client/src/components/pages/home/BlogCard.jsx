// src/components/BlogCard.jsx

import { Button, CustomTagIcon, LazyImage } from '@components'; // Import the LazyImage component
import { usePostContext } from '@contexts/PostContext';
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
        scale: 1.02,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    },
};

const likeButtonVariants = {
    tap: { scale: 0.9 },
};

const BlogCard = memo(function BlogCard({ post, author, cookie }) {
    const navigate = useNavigate();
    const { like, unlike } = usePostContext();

    const handleLikeClick = useCallback(
        (e) => {
            e.stopPropagation(); // Prevent card click
            const postId = post.postId || post._id;
            if (post.likesBy?.map(id => id.toString()).includes(cookie)) { // Ensure consistent ID types
                unlike(postId);
            } else {
                like(postId);
            }
        },
        [post, cookie, like, unlike]
    );

    const navigateToPost = useCallback(() => navigate(`/blog/${post.postId || post._id}`), [
        navigate,
        post,
    ]);

    const isLiked = post.likesBy?.map(id => id.toString()).includes(cookie); // Ensure consistent ID types

    // Debugging: Log post.category
    console.log(`Rendering BlogCard for category: ${post.category}`);

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
                            // Placeholder to maintain layout consistency
                            <span className="blog-post-card__content__title-category__category__text"></span>
                        )}
                    </div>
                </div>

                {/* <div className="blog-post-card__content__content-text">
                    <span className="blog-post-card__content__content-text__quote">
                        <span className="blog-post-card__content__content-text__quote__opening-quote">"</span>
                        {truncatedContent}
                        <span className="blog-post-card__content__content-text__quote__closing-group">
                            <span className="blog-post-card__content__content-text__quote__closing-quote">"</span>
                        </span>
                    </span>
                </div> */}

                <div className="blog-post-card__content__interactions">
                    <Button
                        className="blog-post-card__content__interactions__like-button"
                        onClick={handleLikeClick}
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                        variant="like"
                        filled={isLiked}
                    >
                        <motion.span
                            className={`blog-post-card__content__interactions__like-button__heart-icon ${isLiked ? 'blog-post-card__content__interactions__like-button__heart-icon--liked' : ''}`}
                            variants={likeButtonVariants}
                            whileTap="tap"
                            aria-hidden="true"
                        ></motion.span>
                        <span className="blog-post-card__content__interactions__like-button__likes-count">{post.likes}</span>
                    </Button>
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
    cookie: PropTypes.string.isRequired,
};

export default BlogCard;