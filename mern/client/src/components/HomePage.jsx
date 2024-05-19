import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import Post from "./PostModal";

export default function HomePage() {
	const [userData, setUserData] = useState({
		first_name: "",
		last_name: "",
		status: "",
		email: "",
		birthdate: "",
		occupation: "",
		location: "",
	});
	const [userPosts, setUserPosts] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			const data = {
				user: {
					first_name: "Ash",
					last_name: "Ketchum",
					status: "",
					email: "AshK@CatchEmAll.com",
					birthdate: "05/22/1987",
					occupation: "Pokemon Trainer",
					location: "Pallet Town",
				},
				posts: [
					{
						content: "",
						postDate: "",
						comments: "",
					},
				],
			};
			setUserData(data.user);
			setUserPosts(data.posts);
		};

		fetchUserData();
	}, []);

  const [newStatus, setNewStatus] = useState("");

	const handleEditStatus = () => {
		const status = prompt("Enter new status:");
		if (status !== null) {
			setUserData({ ...userData, status });
		}
	};

	const getInitials = (first_Name, last_name) => {
		const firstInitial = first_Name ? first_Name.charAt(0).toUpperCase() : "";
		const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(userData.first_name, userData.last_name);

	return (
		<div className="main-container">
			<div className="user-card-container">
				<Card className="user-card">
					<Card.Title>{userInitials}</Card.Title>
					<div className="card-text">
						<ul>
							<li>
      							<span>Status:</span>{" "}
      							<input
        							type="text"
       								value={userData.status}
        							onChange={(e) =>
          							setUserData({ ...userData, status: e.target.value })
        							}
     							/>
      							<Button onClick={handleEditStatus} className="edit-button">
        							Edit
      							</Button>
							</li>
							<li>
								<span>Email:</span> {userData.email}
							</li>
							<li>
								<span>Birthdate:</span> {userData.birthdate}
							</li>
							<li>
								<span>Occupation:</span> {userData.occupation}
							</li>
							<li>
								<span>Location:</span> {userData.location}
							</li>
						</ul>
					</div>
				</Card>
			</div>
			<div className="post-card-container">
				<Card className="posts-card">
					<Card.Body>
						<Card.Title>Posts</Card.Title>
						{userPosts.length > 0 ? (
							userPosts.map((post, index) => (
								<Post
									key={index}
									content={post.content}
									postDate={post.postDate}
									comments={post.comments}
								/>
							))
						) : (
							<p>No posts available.</p>
						)}
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
