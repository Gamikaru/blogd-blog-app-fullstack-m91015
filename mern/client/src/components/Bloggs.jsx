import React, { useState } from "react";
import { Container, Card } from "react-bootstrap";

const dummyData = [
	{
		id: 1,
		first_name: "John",
		last_name: "Doe",
		content: "This is the content of the first blog post.",
		author: "John Doe",
		date: "2024-05-01",
		comments: [
			{ id: 1, author: "Jane Smith", text: "Great post!" },
		],
	},
	{
		id: 2,
		first_name: "Jane",
		last_name: "Smith",
		content: "This is the content of the second blog post.",
		author: "Jane Smith",
		date: "2024-05-02",
		comments: [{ id: 1, author: "John Doe", text: "Nice article!" }],
	},
	{
		id: 3,
		first_name: "Alice",
		last_name: "Johnson",
		content: "This is the content of the third blog post.",
		author: "Alice Johnson",
		date: "2024-05-03",
		comments: [],
	},
];

export default function BloggsPosts() {
	const [blogPosts] = useState(dummyData);

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	return (
		<Container className="blogg-container">
			<h1 className="bloggs-heading">Recent Blog Posts</h1>
			<div className="blog-posts">
				{blogPosts.map((post, index) => (
					<Card className="post-section" key={index}>
						<Card.Body className="bloggs-body">
							<Card.Title className="card-title">
								{getInitials(post.first_name, post.last_name)}
							</Card.Title>
							<Card.Text className="card-text">{post.content} </Card.Text>
						</Card.Body>
						<Card.Footer className="card-footer">
							<small className="text-muted">
								<span className="blog-author">{post.author} </span>
								<span className="blog-date">{post.date} </span>
							</small>
							<button className="like-button">Like</button>
						</Card.Footer>
						<div className="comments">
							{post.comments.map((comment) => (
								<div key={comment.id} className="comment">
									<p className="comment-author"> {comment.author}</p>
									<p className="comment-text">{comment.text}</p>
								</div>
							))}
						</div>
					</Card>
				))}
				{blogPosts.length === 0 && (
					<p className="no-blog-posts">No blog posts available.</p>
				)}
			</div>
		</Container>
	);
}
