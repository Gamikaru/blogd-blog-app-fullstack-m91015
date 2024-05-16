import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useCookies } from "react-cookie";
import Post from "./Post"; // Import the Post component

export default function HomePage() {
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		username: "",
	});
	const [userPosts, setUserPosts] = useState([]);
	const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

	useEffect(() => {
		// Fetch user data and posts after successful login
		// Replace with your actual data fetching logic
		const fetchUserData = async () => {
			// Dummy user data and posts
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

	// Function to get initials
	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(userData.firstName, userData.lastName);

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-12">
					<Card className="user-info-card">
						<Card.Body>
							<Card.Title>{userInitials}</Card.Title>
							<Card.Text>Email: {userData.email}</Card.Text>
							<Card.Text>Username: {userData.username}</Card.Text>
						</Card.Body>
					</Card>
				</div>
				<div className="col-md-12 mt-4">
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
		</div>
	);
}
