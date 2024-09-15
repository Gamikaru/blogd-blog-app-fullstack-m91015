import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

// custom scss imports
import "../styles/custom_component_styles/admin_page.scss"; // scss file for Admin-specific styles

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
				className="admin-modal-container"
				show={showModal}
				onHide={handleCloseModal}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="admin-modal-title">Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body className="admin-modal-message">{modalMessage}</Modal.Body>
				<Modal.Footer>
					<Button
						className="admin-modal-button"
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
