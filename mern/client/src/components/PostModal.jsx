import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function PostModal({ show, handleClose }) {

	const [cookie, setCookie, removeCookie] = useCookies();

    const [content, setContent] = useState("");
    const handleCreatePost = async (content) => {
	console.log(content);
	try {
	  await savePostToServer(content);
	} catch (error) {
		console.error("Error creating post:", error);
	}
};

const savePostToServer = async (post) => {
	console.log(post);
	try {
		const response = await fetch(`http://localhost:5050/post/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookie.PassBloggs}`,
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPost = { content, postDate: new Date().toLocaleString(), likes: 0 };
            await handleCreatePost(newPost);
            setContent("");
            handleClose();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a Post!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="postContent">
                        <Form.Control
                            className="text-form"
                            as="textarea"
                            rows={5}
                            value={content}
                            onChange={handleChange}
                            placeholder="Write your post here..."
                        />
                    </Form.Group>
                    <Button className="submit-button" type="submit">
                        Post
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}