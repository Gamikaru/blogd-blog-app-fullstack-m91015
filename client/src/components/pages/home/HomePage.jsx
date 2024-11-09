// HomePage.jsx
import { Bloggs, CubeSlider, fetchTrendingArticles, Logger, Spinner, usePostContext, useUser } from '@components';
import React, { Suspense, useEffect, useState } from "react";

// const PostCard = lazy(() => import("./PostCard"));

const HomePage = () => {
    const { user, loading } = useUser();
    const { posts, fetchPostsByUser } = usePostContext();
    const [error, setError] = useState(null);
    const [postsFetched, setPostsFetched] = useState(false);
    const [articles, setArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);

    useEffect(() => {
        const loadArticles = async () => {
            setArticlesLoading(true);
            try {
                const trendingArticles = await fetchTrendingArticles();
                setArticles(trendingArticles.length ? trendingArticles : []);
                if (!trendingArticles.length) setError('No articles available');
            } catch (err) {
                Logger.error("Error loading trending articles:", err);
                setError("Failed to load trending articles");
            } finally {
                setArticlesLoading(false);
            }
        };
        loadArticles();
    }, []);

    // useEffect(() => {
    //     if (user && user._id && !postsFetched) {
    //         fetchPostsByUser(user._id)
    //             .then(() => setPostsFetched(true))
    //             .catch((err) => {
    //                 setError("Error fetching user posts.");
    //                 Logger.error("Error fetching user posts:", err);
    //             });
    //     }
    // }, [user, fetchPostsByUser, postsFetched]);

    if (loading) return <Spinner message="Loading user data..." />;
    if (error) return <p>{error}</p>;
    if (!user || !user._id) return <p>User data not available.</p>;

    return (
        <div className="home-page-container">
            {/* CubeSlider placed above the page-container */}
            <CubeSlider />
            <div className="page-container">
                {/* Carousel Section
                <section className="carousel-section">
                    <Carousel articles={articles} loading={articlesLoading} />
                </section> */}

                {/* Content Section
                <section className="content-section">
                    <Suspense fallback={<Spinner message="Loading components..." />}>
                        <div className="cards-container">
                            <PostCard userPosts={posts} />
                        </div>
                    </Suspense>
                </section> */}

                {/* Integrated Bloggs Section */}
                <section id="bloggs-section" className="bloggs-section">
                    <Suspense fallback={<Spinner message="Loading blog posts..." />}>
                        <Bloggs />
                    </Suspense>
                </section>
            </div>
        </div>
    );
};

export default HomePage;