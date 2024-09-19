import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ApiClient from "../ApiClient"; // Import ApiClient
import { useUser } from "../UserContext"; // Import useUser hook

export default function PostModal({ show, handleClose, onPostSuccess }) {
	const [postContent, setPostContent] = useState("");
	const { user } = useUser(); // Get user from UserContext

	const handlePostSubmit = async (e) => {
		e.preventDefault();

		if (!postContent.trim()) {
			alert("Post content cannot be empty.");
			return;
		}

		const newPost = {
			content: postContent,
			userId: user._id,
		};

		try {
			const response = await ApiClient.post("/post", newPost);
			const createdPost = response.data.post;

			setPostContent(""); // Reset form content
			onPostSuccess(createdPost); // Trigger the post addition to the userPosts list
			handleClose(); // Close modal
		} catch (error) {
			console.error("Error creating post:", error.message);
			alert("Failed to create post. Please try again.");
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered className="post-modal-container">
			<Modal.Header closeButton className="post-modal-header">
				<Modal.Title className="modal-title">Create Post</Modal.Title>
			</Modal.Header>
			<Modal.Body className="post-modal-body">
				<Form onSubmit={handlePostSubmit} className="post-form">
					<Form.Group controlId="postContent">
						<Form.Label>Post Content</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={postContent}
							onChange={(e) => setPostContent(e.target.value)}
							placeholder="What's on your mind?"
							className="post-modal-input"
						/>
					</Form.Group>
					<Button type="submit" className="post-submit-btn w-100 mt-3">
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}