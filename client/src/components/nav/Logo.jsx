import React from 'react';
import { Link } from 'react-router-dom';

const Logo = React.memo(() => (
    <div className="navbar-logo-container">
        <Link to="/">
            <img
                alt="Codeblogs Website Logo"
                aria-label="Codeblogs Logo"
                className="nav-logo-image"
                src="/assets/images/Icon-Only-Black.png"
                loading="lazy"

            />
        </Link>
    </div>
));

export default Logo;

Logo.displayName = 'Logo';