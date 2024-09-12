import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
// Import the relevant CSS for Admin styling
import "../styles/admin_page.css"; // Assuming you have a styles folder with Admin.css

export default function Admin() {
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState("");

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<div className="admin-container">
				{/* User Manager Card */}
				<Link to="/user-manager">
					<Card className="admin-card user-manager-card">
						<Card.Body className="admin-card-body">
							<Card.Title className="admin-card-title">User Manager</Card.Title>
						</Card.Body>
					</Card>
				</Link>

				{/* Content Manager Card */}
				<Link to="/content-manager">
					<Card className="admin-card content-manager-card">
						<Card.Body className="admin-card-body">
							<Card.Title className="admin-card-title">Content Manager</Card.Title>
						</Card.Body>
					</Card>
				</Link>
			</div>

			{/* Modal for Confirmation */}
			<Modal
				className="admin-toast-container"
				show={showModal}
				onHide={handleCloseModal}
				centered
			>
				<Modal.Title className="admin-toast-title">Confirmation</Modal.Title>
				<Modal.Body className="admin-toast-message">{modalMessage}</Modal.Body>
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
