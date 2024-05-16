import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Post({ content, postDate, likes, comments }) {
	return (
		<Card className="post-card">
			<Card.Body>
				<Card.Text>{content}</Card.Text>
				<Card.Subtitle className="mb-2 text-muted">
					{new Date(postDate).toLocaleString()}
				</Card.Subtitle>
				<Button variant="primary">Like ({likes})</Button>
				<div className="comments-section">
					<h6>Comments</h6>
					<ul>
						{comments.map((comment, index) => (
							<li key={index}>{comment}</li>
						))}
					</ul>
				</div>
			</Card.Body>
		</Card>
	);
}
