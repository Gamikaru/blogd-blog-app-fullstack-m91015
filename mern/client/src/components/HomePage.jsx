import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import PostModal from "./PostModal";

// UserCard component
const UserCard = ({ userInitials, userData }) => (
	<div className="user-card-container">
		<Card className="user-card">
			<Card.Title>{userInitials}</Card.Title>
			<div className="card-text">
				<ul>
					<li>
						<span>Status:</span> {userData.status}
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
);

// PostsCard component
const PostsCard = ({ userPosts, showModal, handleLike, setShowModal }) => (
	<div className="post-card-container">
		<Card className="posts-card">
			<Card.Body>
				<Card.Title>Posts</Card.Title>
				{userPosts.length > 0 ? (
					userPosts.map((post, index) => (
						<div key={index}>
							<p>{post.content}</p>
							<p>{post.postDate}</p>
							<Button onClick={() => handleLike(index)}>Like</Button>
							<p>Likes: {post.likes}</p>
						</div>
					))
				) : (
					<p>No posts available.</p>
				)}
				<Button onClick={() => setShowModal(true)}>Make a Post!</Button>
			</Card.Body>
		</Card>
	</div>
);

// HomePage component
export default function HomePage() {
	const [userData, setUserData] = useState({
		first_name: "",
		last_name: "",
		status: "",
		email: "",
		birthdate: "",
		occupation: "",
		location: "",
		status: "",
	});
	const [userPosts, setUserPosts] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			// Fetch user data from server
			const response = await fetch("http://localhost:5050/user");
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			setUserData(data.user);
			setUserPosts(data.posts);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const handleCreatePost = async (content) => {
		try {
			// Create new post
			const newPost = {
				content,
				postDate: new Date().toLocaleString(),
				comments: [],
				likes: 0,
			};
			setUserPosts([newPost, ...userPosts]);
			setShowModal(false); // Close modal after creating post

			// Send post data to server to save
			await savePostToServer(newPost);
		} catch (error) {
			console.error("Error creating post:", error);
		}
	};

	const savePostToServer = async (post) => {
		try {
			const response = await fetch("http://localhost:5050/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(post),
			});
			if (!response.ok) {
				throw new Error(`Failed to save post: ${response.statusText}`);
			}
		} catch (error) {
			console.error("Error saving post:", error);
		}
	};

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(userData.first_name, userData.last_name);

	const handleLike = (index) => {
		setUserPosts((prevPosts) => {
			const updatedPosts = [...prevPosts];
			updatedPosts[index].likes += 1;
			return updatedPosts;
		});
	};

	return (
		<div className="main-container">
			<UserCard userInitials={userInitials} userData={userData} />
			<PostsCard
				userPosts={userPosts}
				showModal={showModal}
				handleLike={handleLike}
				setShowModal={setShowModal}
			/>
			<PostModal
				show={showModal}
				handleClose={() => setShowModal(false)}
				createPost={handleCreatePost}
			/>
		</div>
	);
}
