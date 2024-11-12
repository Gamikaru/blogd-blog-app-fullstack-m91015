import { Blogs, CubeSlider, Spinner } from '@components';
import { useUser } from '@contexts/UserContext';
import { Suspense, useState } from 'react';

const HomePage = () => {
    const { user, loading: userLoading } = useUser();
    const [error, setError] = useState(null);

    if (userLoading) {
        return <Spinner message="Loading..." />;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="home-page-container">
            <CubeSlider />
            <div className="page-container">
                <section id="blogs-section" className="blogs-section">
                    <Suspense fallback={<Spinner message="Loading blog posts..." />}>
                        <Blogs />
                    </Suspense>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
