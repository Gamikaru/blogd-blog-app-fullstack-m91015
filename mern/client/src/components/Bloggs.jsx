import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function BloggsPosts() {
	const [blogPosts, setBlogPosts] = useState([
		{
			title: "First Blog Post",
			content: "This is the content of the first blog post.",
			author: "John Doe",
			date: "2024-05-01",
		},
		{
			title: "Second Blog Post",
			content: "This is the content of the second blog post.",
			author: "Jane Smith",
			date: "2024-05-02",
		},
		{
			title: "Third Blog Post",
			content: "This is the content of the third blog post.",
			author: "Alice Johnson",
			date: "2024-05-03",
		},
	]);

	useEffect(() => {
		// Uncomment the below code when ready to fetch from the server
		/*
		const fetchBloggsPosts = async () => {
			try {
				const response = await fetch("http://localhost:5050/post/blogPosts");
				if (!response.ok) {
					throw new Error("Failed to fetch blog posts");
				}
				const data = await response.json();
				setBlogPosts(data);
			} catch (error) {
				console.error("Error fetching blog posts:", error);
			}
		};

		fetchBloggsPosts();
		*/
	}, []);

	return (
		<Container className="blogg-container">
			<h1 className="bloggs-heading">Recent Blog Posts</h1>
			<div className="blog-posts">
				{blogPosts.map((post, index) => (
					<Card className="post-section mb-4" key={index}>
						<Card.Body>
							<Card.Title>{post.title}</Card.Title>
							<Card.Text>{post.content}</Card.Text>
						</Card.Body>
						<Card.Footer className="poster-info">
							<small className="text-muted">
								<span className="blog-author">{post.author} </span>
								<span className="blog-date">{post.date} </span>
							</small>
						</Card.Footer>
					</Card>
				))}
				{blogPosts.length === 0 && <p>No blog posts available.</p>}
			</div>
		</Container>
	);
}
