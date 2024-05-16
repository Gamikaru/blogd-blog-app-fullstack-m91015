import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function Navbar() {
	const location = useLocation();
	// Don't render the navbar on the login and registration pages
	if (location.pathname === "/" || location.pathname === "/register") {
		return null;
	}
	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<NavLink to="/Home">
						<img
							alt="CodeBloggs logo"
							className="h-10 inline"
							src="/CodeBloggs logo2.png"
						/>
					</NavLink>
				</nav>
			</div>
			<div className="nav-container">
				<div className="nav">
					<Card>
						<ul>
							<li>
								<NavLink to="/home" className="active">
									Home
								</NavLink>
							</li>
							<li>
								<NavLink to="/bloggs" className="active">
									Bloggs
								</NavLink>
							</li>
							<li>
								<NavLink to="/network" className="active">
									Network
								</NavLink>
							</li>
							<li>
								<NavLink to="/admin" className="active">
									Admin
								</NavLink>
							</li>
						</ul>
					</Card>
				</div>
			</div>
		</>
	);
}
