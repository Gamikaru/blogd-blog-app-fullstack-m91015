import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

export default function PostModal({ show, handleClose, onSubmit }) {
	const [content, setContent] = useState("");

	const handleSubmit = () => {
		onSubmit(content);
		setContent("");
		handleClose();
	};

	return (
		<Modal show={show} onHide={handleClose} dialogClassName="modal-dialog">
				<Modal.Header closeButton>
					<Modal.Title>Create Post</Modal.Title>
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
									onChange={(e) => setContent(e.target.value)}
									placeholder="Write your post here..."
								/>
								<Button
									variant="primary"
									onClick={handleSubmit}
									className="submit-button"
								>
									Submit
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Modal.Body>
		</Modal>
	);
}
