import { NavLink } from "react-router-dom";

export default function Navbar() {
	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<NavLink to="/login">
						<img
							alt="CodeBloggs logo"
							className="h-10 inline"
							src="/CodeBloggs logo2.png"
						></img>
					</NavLink>
				</nav>
			</div>
			<div className="nav-container">
				<div className="nav">
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
				</div>
			</div>
		</>
	);
}