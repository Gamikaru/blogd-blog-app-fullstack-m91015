import React, { useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Admin() {
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState("");

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<div>
				<Link to="/user-manager">
					<Card className="user-manager">
						<Card.Body className="user-body">
							<Card.Title className="user-title">User Manager</Card.Title>
						</Card.Body>
					</Card>
				</Link>
			</div>
			<div>
				<Link to="/content-manager">
					<Card className="content-manager">
						<Card.Body className="content-body">
							<Card.Title className="content-title">Content Manager</Card.Title>
						</Card.Body>
					</Card>
				</Link>
			</div>
			<Modal
				className="admin-toast-container"
				show={showModal}
				onHide={handleCloseModal}
				centered
			>
				<Modal.Title className="admin-toast-title">Confirmation</Modal.Title>
				<Modal.Body className="admin-toast-mssg">{modalMessage}</Modal.Body>
				<Modal.Footer>
					<Button
						className="admin-toast-button"
						variant="primary"
						onClick={handleCloseModal}
					>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
