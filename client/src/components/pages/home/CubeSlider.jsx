// CubeSlider.jsx

import { ErrorBoundary } from '@components';
import { usePostContext } from '@contexts';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { Autoplay, EffectCube } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cube';

// Import components eagerly
import ImageSlide from './ImageSlide';
import TextSlide from './TextSlide';

const CubeSlider = () => {
    const { topLikedPosts, loadTopLikedPosts, isLoading, error } = usePostContext();

    useEffect(() => {
        if (!topLikedPosts.length) {
            loadTopLikedPosts();
        }
    }, [topLikedPosts.length, loadTopLikedPosts]);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
        },
    }), []);

    const imageSwiperProps = useMemo(() => ({
        direction: 'vertical',
        effect: 'cube',
        grabCursor: true,
        cubeEffect: { shadow: false, slideShadows: false },
        speed: 1000, // Transition speed
        autoplay: { delay: 3000, disableOnInteraction: false }, // Reduced delay for faster transitions
        modules: [EffectCube, Autoplay],
        loop: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
    }), []);

    const textSwiperProps = useMemo(() => ({
        effect: 'cube',
        grabCursor: true,
        cubeEffect: { shadow: false, slideShadows: false },
        speed: 1000, // Transition speed
        autoplay: { delay: 3000, disableOnInteraction: false }, // Reduced delay for faster transitions
        modules: [EffectCube, Autoplay],
        loop: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
    }), []);

    if (isLoading) {
        return <div className="cube-slider-loading">Loading...</div>;
    }

    if (error) {
        return <div className="cube-slider-error">{error}</div>;
    }

    if (!topLikedPosts.length) {
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
                {/* Removed Suspense since components are loaded eagerly */}
                <ErrorBoundary>
                    <ImageSlide posts={topLikedPosts} swiperProps={imageSwiperProps} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <TextSlide posts={topLikedPosts} swiperProps={textSwiperProps} />
                </ErrorBoundary>
            </motion.div>
        </ErrorBoundary>
    );
};

export default CubeSlider;
