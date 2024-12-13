import React, { useMemo } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = React.memo(() => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const socialLinks = useMemo(() => [
        { href: 'https://facebook.com', label: 'Facebook', Icon: FaFacebookF },
        { href: 'https://twitter.com', label: 'Twitter', Icon: FaTwitter },
        { href: 'https://instagram.com', label: 'Instagram', Icon: FaInstagram },
        { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
    ], []);

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
                <div className="footer__social">
                    {socialLinks.map(({ href, label, Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label={`Follow us on ${label}`}
                        >
                            <Icon />
                        </a>
                    ))}
                </div>
                <div className="footer__copy">
                    &copy; {currentYear} Blogd. All rights reserved.
                </div>
            </div>
        </footer>
    );
});

Footer.displayName = 'Footer';

export default Footer;