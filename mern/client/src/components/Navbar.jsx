import { NavLink } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function Navbar() {
	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<NavLink to="/">
						<img
							alt="CodeBloggs logo"
							className="h-10 inline"
							src="/CodeBloggs logo2.png"
						></img>
					</NavLink>
				</nav>
			</div>
			<div className="nav-container">
				<nav className="nav">
					<Card>
						<ul>
							<li>
								<NavLink to="/HomePage">Home</NavLink>
							</li>
							<li>
								<NavLink to="/bloggs">Bloggs</NavLink>
							</li>
							<li>
								<NavLink to="/network">Network</NavLink>
							</li>
							<li>
								<NavLink to="/admin">Admin</NavLink>
							</li>
						</ul>
					</Card>
				</nav>
			</div>
		</>
	);
}