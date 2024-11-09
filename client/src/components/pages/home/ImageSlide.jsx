// ImageSlide.jsx
import React, { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const ImageSlide = memo(({ posts, swiperProps }) => {
    const navigate = useNavigate();
    const [loadedImages, setLoadedImages] = useState({});
    const swiperRef = useRef(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleImageLoad = (postId) => {
        if (mounted.current) {
            setLoadedImages(prev => ({ ...prev, [postId]: true }));
            // Update swiper after image loads
            if (swiperRef.current) {
                swiperRef.current.update();
            }
        }
    };

    return (
        <div className="cube-slider-container image-slider-container">
            <Swiper
                {...swiperProps}
                className="cube-slider"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onDestroy={() => {
                    swiperRef.current = null;
                }}
            >
                {posts.map((post) => {
                    const imageSrc =
                        post.imageUrls?.length > 0
                            ? post.imageUrls[0]
                            : post.images?.length > 0
                                ? `data:image/jpeg;base64,${post.images[0].data}`
                                : '/assets/images/High-Resolution-Logo-White-on-Black-Background.png';

                    return (
                        <SwiperSlide
                            key={`image-${post._id}`}
                            onClick={() => navigate(`/blog/${post._id}`)}
                        >
                            <div className="cube-slide">
                                <div
                                    className="swiper-lazy-preloader"
                                    style={{
                                        display: loadedImages[post._id] ? 'none' : 'block',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                                <img
                                    src={imageSrc}
                                    alt={post.title || 'Untitled Post'}
                                    loading="lazy"
                                    decoding="async"
                                    width="100%"
                                    height="auto"
                                    onLoad={() => handleImageLoad(post._id)}
                                    onError={(e) => {
                                        if (mounted.current) {
                                            e.target.onerror = null;
                                            e.target.src = '/default-placeholder-image.jpg';
                                        }
                                    }}
                                    style={{
                                        opacity: loadedImages[post._id] ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
});

ImageSlide.displayName = 'ImageSlide';
export default ImageSlide;