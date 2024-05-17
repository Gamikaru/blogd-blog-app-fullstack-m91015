import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Dropdown, DropdownToggle } from "react-bootstrap";
// import { toast } from "react-toastify";

export default function Navbar({ first_name, last_name }) {
    const location = useLocation();

    // Don't render the navbar on the login and registration pages
    if (location.pathname === "/" || location.pathname === "/register") {
        return null;
    }

    // Combine first name and last name to form the full name
    const userName = `${first_name} ${last_name}`;

    return (
			<>
				<div className="nav-header">
					<nav className="navbar">
						<a href="/home">
							<img
								alt="CodeBloggs logo"
								className="nav-logo-image"
								src="/CodeBloggs logo.png"
							/>
						</a>
					</nav>
				</div>
				<div className="nav-container">
					<div className="nav">
						<Card>
							<ul>
								<li>
									<a href="/home" className="active">
										Home
									</a>
								</li>
								<li>
									<a href="/bloggs" className="active">
										Bloggs
									</a>
								</li>
								<li>
									<a href="/network" className="active">
										Network
									</a>
								</li>
								<li>
									<a href="/admin" className="active">
										Admin
									</a>
								</li>
							</ul>
						</Card>
					</div>
				</div>
			</>
		);
}
