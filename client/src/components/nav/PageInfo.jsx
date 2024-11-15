// client/src/components/nav/PageInfo.jsx
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import React from "react";
import { NavLink } from "react-router-dom";

const PageInfo = React.memo(({ welcomeText, categories, location }) => {
    const pageInfoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="info-and-explore-container">
            <motion.div
                className="page-info-message"
                variants={pageInfoVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h1 className="page-title">{welcomeText.title}</h1>
                {welcomeText.subtitle && (
                    <p className="page-subtitle">{welcomeText.subtitle}</p>
                )}
            </motion.div>

            {location.pathname === "/" && (
                <div className="explore-links">
                    {categories.map((category) => (
                        <NavLink
                            key={category}
                            to={`/${category.toLowerCase()}`}
                            className="explore-link"
                        >
                            {category}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
});

PageInfo.displayName = 'PageInfo';

PageInfo.propTypes = {
    welcomeText: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
    }).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};

export default PageInfo;