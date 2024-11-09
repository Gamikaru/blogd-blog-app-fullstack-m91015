// TextSlide.jsx
import { sanitizeContent } from '@components';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const TextSlide = memo(({ posts, swiperProps }) => {
    const navigate = useNavigate();
    const titleRefs = useRef([]);

    const adjustFontSize = useMemo(
        () => () => {
            titleRefs.current.forEach((titleRef) => {
                if (titleRef) {
                    const parentWidth = titleRef.parentElement.offsetWidth;
                    let fontSize = parseInt(window.getComputedStyle(titleRef).fontSize);
                    while (titleRef.scrollWidth > parentWidth && fontSize > 16) {
                        fontSize -= 1;
                        titleRef.style.fontSize = `${fontSize}px`;
                    }
                    titleRef.style.minHeight = '3rem';
                }
            });
        },
        []
    );

    useEffect(() => {
        const debouncedAdjustFontSize = debounce(adjustFontSize, 250);
        debouncedAdjustFontSize();
        window.addEventListener('resize', debouncedAdjustFontSize);
        return () => window.removeEventListener('resize', debouncedAdjustFontSize);
    }, [adjustFontSize, posts]);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const processedPosts = useMemo(
        () =>
            posts.map((post) => ({
                ...post,
                formattedDate: new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                authorName: `${post.userId.firstName} ${post.userId.lastName}`,
                excerpt: (() => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = sanitizeContent(post.content);
                    return `${tempDiv.textContent.slice(0, 200)}${tempDiv.textContent.length > 200 ? '...' : ''
                        }`;
                })(),
            })),
        [posts]
    );

    return (
        <div className="cube-slider-container text-slider-container">
            <Swiper {...swiperProps} className="cube-slider">
                {processedPosts.map((post, index) => (
                    <SwiperSlide
                        key={post._id}
                        onClick={() => navigate(`/blog/${post._id}`)}
                        tabIndex="0"
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
                                <span className="post-author">By {post.authorName}</span>
                                <span className="post-date">{post.formattedDate}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});

TextSlide.displayName = 'TextSlide';
export default TextSlide;