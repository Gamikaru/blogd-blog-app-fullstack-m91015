import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import PostModal from "./PostModal";
import { useCookies } from "react-cookie";

const UserCard = ({ userInitials, user, updateUserStatus }) => (
	<div className="user-card-container">
		<Card className="user-card">
			<Card.Title className="initials-title">{userInitials}</Card.Title>
			<div className="home-card-text">
				<ul>
					<li>
						<span>Status: </span>
						<input
							className="home-user-status"
							type="text"
							value={user.status}
							onChange={(e) => updateUserStatus(e.target.value)}
							placeholder="Update Status"
						/>
					</li>
					<li>
						<span> Email: </span> {user.email}
					</li>
					<li>
						<span> Birthdate: </span> {user.birthdate}
					</li>
					<li>
						<span> Occupation: </span> {user.occupation}
					</li>
					<li>
						<span> Location: </span> {user.location}
					</li>
				</ul>
			</div>
		</Card>
	</div>
);

const PostsCard = ({ userPosts, showModal, handleLike, setShowModal }) => (
	<div className="home-post-card-container">
		<Card className="home-posts-card">
			<Card.Body>
				<Card.Title className="home-post-title">Your Recent Posts!</Card.Title>
				{userPosts.length > 0 ? (
					userPosts.map((post, index) => (
						<div key={index}>
							<p className="home-post-content">{post.content}</p>
							<p>{post.postDate}</p>
							<p className="home-post-likes">Likes: {post.likes}</p>
						</div>
					))
				) : (
					<p>No posts available.</p>
				)}
			</Card.Body>
		</Card>
	</div>
);

export default function HomePage() {
	const [cookie, setCookie, removeCookie] = useCookies();
	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		status: "",
		email: "",
		birthdate: "",
		occupation: "",
		location: "",
	});
	const [userPosts, setUserPosts] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		fetchUser();
		fetchPost();
	}, []);

	const fetchUser = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(`http://localhost:5050/user/${cookie.userID}`, {
				headers: {
				Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data)
			setUser(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const fetchPost = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:5050/post/${cookie.userID}`,
				{
					headers: {
					Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data);
			setUserPosts(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const getInitials = (first_name, last_name) => {
		const firstInitial = first_name ? first_name.charAt(0).toUpperCase() : "";
		const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const userInitials = getInitials(user.first_name, user.last_name);

	const handleLike = (index) => {
		setUserPosts((prevPosts) => {
			const updatedPosts = [...prevPosts];
			updatedPosts[index].likes += 1;
			return updatedPosts;
		});
	};

	const updateUserStatus = async (newStatus) => {
		try {
			const token = cookie.PassBloggs;
			if (!token) {
				console.error("Token not found in localStorage");
				return;
			}
			const response = await fetch(
				`http://localhost:5050/user/${cookie.userID}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: newStatus }),
				}
			);
			if (!response.ok) {
				throw new Error(`Failed to update user status: ${response.statusText}`);
			}
			setUser((prevUser) => ({ ...prevUser, status: newStatus }));
		} catch (error) {
			console.error("Error updating user status:", error);
		}
	};

	return (
		<div className="main-container">
			<UserCard
				userInitials={userInitials}
				user={user}
				updateUserStatus={updateUserStatus}
			/>
			<PostsCard
				userPosts={userPosts}
				showModal={showModal}
				handleLike={handleLike}
				setShowModal={setShowModal}
			/>
			<PostModal
				show={showModal}
				handleClose={() => setShowModal(false)} />
		</div>
	);
}
