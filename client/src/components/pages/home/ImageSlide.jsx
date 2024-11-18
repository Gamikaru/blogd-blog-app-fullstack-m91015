// ImageSlide.jsx

import PropTypes from 'prop-types';
import { memo, useEffect, useRef, useState } from 'react';
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
            setLoadedImages((prev) => ({ ...prev, [postId]: true }));
            if (swiperRef.current) {
                swiperRef.current.update();
            }
        }
    };

    return (
        <div className="cube-slider__container cube-slider__container--image">
            <Swiper
                {...swiperProps}
                className="cube-slider__slider"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onDestroy={() => {
                    swiperRef.current = null;
                }}
            >
                {posts.map((post) => {
                    const postId = post.postId || post._id;
                    const imageSrc =
                        post.imageUrls?.[0] ||
                        (post.images?.[0]?.data
                            ? `data:image/jpeg;base64,${post.images[0].data}`
                            : '/assets/images/default-placeholder-image.jpg');

                    return (
                        <SwiperSlide
                            key={`image-${postId}`}
                            onClick={() => navigate(`/blog/${postId}`)}
                        >
                            <div className="cube-slider__slider__slide">
                                <div
                                    className="swiper-lazy-preloader"
                                    style={{
                                        display: loadedImages[postId] ? 'none' : 'block',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                                <img
                                    src={imageSrc}
                                    alt={post.title || 'Untitled Post'}
                                    loading="eager"
                                    decoding="async"
                                    width="100%"
                                    height="auto"
                                    onLoad={() => handleImageLoad(postId)}
                                    onError={(e) => {
                                        if (mounted.current) {
                                            e.target.onerror = null;
                                            e.target.src =
                                                '/assets/images/default-placeholder-image.jpg';
                                        }
                                    }}
                                    style={{
                                        opacity: loadedImages[postId] ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
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

ImageSlide.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string,
            _id: PropTypes.string,
            title: PropTypes.string,
            imageUrls: PropTypes.arrayOf(PropTypes.string),
            images: PropTypes.arrayOf(
                PropTypes.shape({
                    data: PropTypes.string.isRequired,
                })
            ),
        })
    ).isRequired,
    swiperProps: PropTypes.object.isRequired,
};

ImageSlide.displayName = 'ImageSlide';

export default ImageSlide;