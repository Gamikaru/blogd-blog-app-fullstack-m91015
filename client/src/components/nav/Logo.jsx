import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
    <div className="navbar-logo">
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
);

export default Logo;
