import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
   <div className="navbar-logo">
      <Link to="/">
         <img
            alt="CodeBloggs Website Logo"
            aria-label="CodeBloggs Logo"
            className="nav-logo-image"
            src="/assets/images/CodeBloggsLogo.png"
            loading="lazy"
         />
      </Link>
   </div>
);

export default Logo;
