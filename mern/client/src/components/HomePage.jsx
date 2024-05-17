import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Post from "./Post";

export default function HomePage() {
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		username: "",
	});
	const [userPosts, setUserPosts] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			const data = {
				user: {
					firstName: "John",
					lastName: "Doe",
					email: "john.doe@example.com",
					username: "johndoe",
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

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(userData.firstName, userData.lastName);

	return (
		<div className="main-container">
			<div className="user-card-container">
				<Card className="user-card">
					<Card.Body>
						<Card.Title>{userInitials}</Card.Title>
						<Card.Text>Email: {userData.email}</Card.Text>
						<Card.Text>Username: {userData.username}</Card.Text>
					</Card.Body>
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
