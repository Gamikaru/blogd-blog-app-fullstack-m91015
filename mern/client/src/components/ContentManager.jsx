import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ContentManager() {
	const [isLoading, setIsLoading] = useState(true); 
	const [posts, setPosts] = useState([]);
	const [searchFromDate, setSearchFromDate] = useState("");
	const [searchUntilDate, setSearchUntilDate] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [postToDelete, setPostToDelete] = useState(null);
	const [cookie, setCookie, removeCookie] = useCookies();
	const navigate = useNavigate();
	
	useEffect(() => {
        fetchPosts();
		fetchUser();
    }, []);

    const fetchUser = async () => {
        const token = cookie.PassBloggs;
        try {
            const response = await fetch(
                `http://localhost:5050/user/${cookie.userID}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

	const fetchPosts = async () => {
		const token = cookie.PassBloggs;
		try {
			const response = await fetch("http://localhost:5050/posts");
			const data = await response.json();
			setPosts(data);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};
	const handleDelete = async (postId) => {
		try {
			await fetch(`http://localhost:5050/posts/${postId}`, {
				method: "DELETE",
			});
			setPosts(posts.filter((post) => post._id !== postId));
			setShowModal(false);
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const handleShowModal = (postId) => {
		setPostToDelete(postId);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<div className="content-manager-container">
			<h1>Content Manager</h1>
			<div className="content-search-section">
				<Form.Control
					type="date"
					placeholder="From"
					value={searchFromDate}
					onChange={(e) => setSearchFromDate(e.target.value)}
				/>
				<Form.Control
					type="date"
					placeholder="Until"
					value={searchUntilDate}
					onChange={(e) => setSearchUntilDate(e.target.value)}
				/>
				{/* <Button onClick={handleSearch}>Search</Button> */}
				<Button onClick={() => setSearchFromDate("") && setSearchUntilDate("")}>
					Show all
				</Button>
			</div>
			{isLoading ? (
				<div className="content-posts-section">
					<Spinner animation="border" role="status">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			) : (
				<div className="content-posts-section">
					{posts.map((post) => (
						<div key={post._id} className="post-item">
							<Card>
								<Card.Body>
									<Card.Title>Blog Post</Card.Title>
									<Card.Text>{post.content}</Card.Text>
									<Button
										variant="danger"
										onClick={() => handleShowModal(post._id)}
									>
										Delete
									</Button>
								</Card.Body>
							</Card>
						</div>
					))}
				</div>
			)}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete this post?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Cancel
					</Button>
					<Button variant="danger" onClick={() => handleDelete(postToDelete)}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
