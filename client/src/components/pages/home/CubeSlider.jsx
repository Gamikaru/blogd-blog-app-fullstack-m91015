// CubeSlider.jsx
// Desc: A slider component that allows users to select a value from a range of values.
import { ErrorBoundary, fetchAllPosts, Logger } from '@components';
import { motion } from 'framer-motion';
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Autoplay, EffectCube } from 'swiper';

const ImageSlide = lazy(() => import('./ImageSlide'));
const TextSlide = lazy(() => import('./TextSlide'));

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cube';

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
    },
};

const sliderVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const imageSwiperProps = {
    direction: 'vertical', // Vertical rotation
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
        shadow: false,
        slideShadows: false,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    speed: 1000, // Increased speed for smoother animation
    autoplay: { delay: 5000, disableOnInteraction: false },
    modules: [EffectCube, Autoplay],
    loop: true,
    watchSlidesProgress: true,
    observer: true,
    observeParents: true,
    freeMode: true, // Enables free mode for smoother transitions
};

const textSwiperProps = {
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
        shadow: false,
        slideShadows: false,
    },
    speed: 1000,
    autoplay: { delay: 5000, disableOnInteraction: false },
    modules: [EffectCube, Autoplay],
    loop: true,
    watchSlidesProgress: true,
    observer: true,
    observeParents: true,
};

const CubeSlider = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        try {
            const allPosts = await fetchAllPosts();
            if (allPosts?.length > 0) {
                setPosts(allPosts);
                Logger.info('Fetched posts:', allPosts);
            }
        } catch (error) {
            Logger.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (isLoading) {
        return <div className="cube-slider-loading">Loading...</div>;
    }

    if (posts.length === 0) {
        return <div className="cube-slider-loading">No posts available</div>;
    }

    return (
        <ErrorBoundary>
            <motion.div
                className="cube-slider-wrapper"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Suspense fallback={<div className="cube-slider-loading">Loading slides...</div>}>
                    <ErrorBoundary>
                        <ImageSlide
                            posts={posts}
                            swiperProps={imageSwiperProps}
                            sliderVariants={sliderVariants}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <TextSlide
                            posts={posts}
                            swiperProps={textSwiperProps}
                            sliderVariants={sliderVariants}
                        />
                    </ErrorBoundary>
                </Suspense>
            </motion.div>
        </ErrorBoundary>
    );
};

export default CubeSlider;