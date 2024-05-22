import React from "react";
import { Card, Container } from "react-bootstrap";

export default function Admin() {
	return (
		<Container className="admin-container">
			<Card className="user-manager">
				<Card.Body className="user-body">
					<Card.Title className="user-title">User Manager</Card.Title>
					<Card.Text className="user-text"></Card.Text>
				</Card.Body>
			</Card>
			<Card className="content-manager">
				<Card.Body className="content-body">
					<Card.Title className="content-title">Content Manager</Card.Title>
					<Card.Text className="content-text"></Card.Text>
				</Card.Body>
			</Card>
		</Container>
	);
}
