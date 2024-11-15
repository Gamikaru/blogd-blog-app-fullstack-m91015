import { Blogs, CubeSlider, Spinner } from '@components';
import { useUser } from '@contexts/UserContext';
import { Suspense } from 'react';

const HomePage = () => {
    const { loading: userLoading } = useUser();

    if (userLoading) {
        return <Spinner message="Loading..." />;
    }

    return (
        <div className="home-page-container">
            <CubeSlider />
            <div className="page-container">
                <section id="blogs-section" className="blogs-section">
                    <Suspense fallback={<Spinner message="Loading blogs..." />}>
                        <Blogs />
                    </Suspense>
                </section>
            </div>
        </div>
    );
};

export default HomePage;