import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

export default function PostModal({ show, handleClose, onSubmit }) {
	const [content, setContent] = useState("");

	const handleSubmit = () => {
		onSubmit(content);
		setContent("");
		handleClose();
	};

	const handleChange = (e) => {
		setContent(e.target.value);
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Card className="modal-card">
				<Modal.Header closeButton>
					<Modal.Title>Create a Post!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card className="post-card">
						<Card.Body>
							<Form className="post-form">
								<Form.Control
									as="textarea"
									rows={5}
									className="post-textarea"
									value={content}
									onChange={handleChange}
									placeholder="Write your post here..."
								/>
								<Button
									variant="primary"
									onClick={handleSubmit}
									className="submit-button"
								>
									POST
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Modal.Body>
			</Card>
		</Modal>
	);
}
