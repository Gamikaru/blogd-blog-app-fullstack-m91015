// TextSlide.jsx

import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, EffectCube } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const TextSlide = memo(({ posts, swiperProps }) => {
    const navigate = useNavigate();
    const titleRefs = useRef([]);

    const adjustFontSize = useCallback(() => {
        titleRefs.current.forEach((titleRef) => {
            if (titleRef) {
                const parentWidth = titleRef.parentElement.offsetWidth;
                let fontSize = parseInt(window.getComputedStyle(titleRef).fontSize, 10);

                while (titleRef.scrollWidth > parentWidth && fontSize > 16) {
                    fontSize -= 1;
                    titleRef.style.fontSize = `${fontSize}px`;
                }

                titleRef.style.minHeight = '3rem';
            }
        });
    }, []);

    const debouncedAdjustFontSize = useMemo(
        () => debounce(adjustFontSize, 250),
        [adjustFontSize]
    );

    useEffect(() => {
        debouncedAdjustFontSize();

        window.addEventListener('resize', debouncedAdjustFontSize);

        return () => {
            window.removeEventListener('resize', debouncedAdjustFontSize);
            debouncedAdjustFontSize.cancel();
        };
    }, [debouncedAdjustFontSize]);

    // TextSlide.jsx

    const processedPosts = useMemo(
        () =>
            posts.map((post) => {
                // Generate excerpt locally if it's undefined
                let excerpt = post.excerpt;
                if (!excerpt) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(post.content || '', 'text/html');
                    const text = doc.body.textContent || '';
                    excerpt = text.split(' ').slice(0, 40).join(' ');
                    if (text.split(' ').length > 40) {
                        excerpt += '...';
                    }
                }

                return {
                    ...post,
                    formattedDate: new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                    authorName: `${post.userId?.firstName || ''} ${post.userId?.lastName || ''}`.trim(),
                    excerpt,
                };
            }),
        [posts]
    );


    return (
        <div className="cube-slider-container text-slider-container">
            <Swiper
                {...swiperProps}
                className="cube-slider"
                modules={[EffectCube, Autoplay]}
            >
                {processedPosts.map((post, index) => {
                    const postId = post.postId || post._id;
                    return (
                        <SwiperSlide
                            key={`text-${postId}`}
                            onClick={() => navigate(`/blog/${postId}`)}
                            tabIndex="0"
                            aria-label={`Navigate to blog post titled ${post.title || 'Untitled Post'
                                }`}
                        >
                            <div className="cube-slide-text">
                                <h3
                                    className="post-title"
                                    ref={(el) => (titleRefs.current[index] = el)}
                                >
                                    {post.title || 'Untitled Post'}
                                </h3>
                                <div className="post-excerpt">
                                    <span className="cube-quote">
                                        <span className="cube-opening-quote">"</span>
                                        {post.excerpt}
                                        <span className="cube-closing-group">
                                            <span className="cube-closing-quote">"</span>
                                        </span>
                                    </span>
                                </div>
                                <div className="post-meta">
                                    <span className="post-author">
                                        By {post.authorName || 'Unknown Author'}
                                    </span>
                                    <span className="post-date">{post.formattedDate}</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
});

TextSlide.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string,
            _id: PropTypes.string,
            createdAt: PropTypes.string.isRequired,
            userId: PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string,
            }),
            title: PropTypes.string,
            excerpt: PropTypes.string, // Made optional
        })
    ).isRequired,
    swiperProps: PropTypes.object.isRequired,
};

TextSlide.displayName = 'TextSlide';
export default TextSlide;
