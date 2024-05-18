import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Post from "./Post";

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
					status: "Motivated",
					email: "AshK@CatchEmAll.com",
					birthdate: "05/22/1987",
					occupation: "Pokemon Trainer",
					location: "Pallet Town",
				},
				posts: [
					{
						content: "This is my first post!",
						postDate: "2023-05-15T12:00:00Z",
						likes: 10,
						comments: ["Great post!", "Nice work!"],
					},
				],
			};
			setUserData(data.user);
			setUserPosts(data.posts);
		};

		fetchUserData();
	}, []);

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
					<Card.Text className="card-text">
 						<ul>
    						<li><span>Status:</span> {userData.status}</li>
    						<li><span>Email:</span> {userData.email}</li>
    						<li><span>Birthdate:</span> {userData.birthdate}</li>
    						<li><span>Occupation:</span> {userData.occupation}</li>
   							<li><span>Location:</span> {userData.location}</li>
  						</ul>
					</Card.Text>
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
									likes={post.likes}
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
