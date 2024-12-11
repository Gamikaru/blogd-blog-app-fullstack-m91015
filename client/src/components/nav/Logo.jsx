import { useThemeContext } from '@contexts'; // <-- Make sure you have this exported in contexts/index.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = React.memo(() => {
    const { theme } = useThemeContext();

    const logoSrc = theme === 'dark'
        ? '/assets/images/Icon-Only-White.svg'
        : '/assets/images/Icon-Only-Black.png';

    return (
        <div className="navbar-logo-container">
            <Link to="/">
                <img
                    alt="Codeblogs Website Logo"
                    aria-label="Codeblogs Logo"
                    className="nav-logo-image"
                    src={logoSrc}
                    loading="lazy"
                />
            </Link>
        </div>
    );
});

Logo.displayName = 'Logo';

export default Logo;
