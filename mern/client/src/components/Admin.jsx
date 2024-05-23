import React, { useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";

export default function Admin() {
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState("");

	const handleCardClick = (cardType) => {
		setModalMessage(`You clicked the ${cardType} card!`);
		setShowModal(true);
		console.log("Modal should appear now");
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<div>
				<Card
					className="user-manager"
					onClick={() => handleCardClick("User Manager")}
				>
					<Card.Body className="user-body">
						<Card.Title className="user-title">User Manager</Card.Title>
					</Card.Body>
				</Card>
			</div>
			<div>
				<Card
					className="content-manager"
					onClick={() => handleCardClick("Content Manager")}
				>
					<Card.Body className="content-body">
						<Card.Title className="content-title">Content Manager</Card.Title>
					</Card.Body>
				</Card>
			</div>
			<Modal
				className="admin-toast-container"
				show={showModal}
				onHide={handleCloseModal}
				centered
			>
				<Modal.Title className="admin-toast-title" >Confirmation</Modal.Title>
				<Modal.Body className="admin-toast-mssg">{modalMessage}</Modal.Body>
				<Modal.Footer>
					<Button className="admin-toast-button" variant="primary" onClick={handleCloseModal}>
						Okay
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
