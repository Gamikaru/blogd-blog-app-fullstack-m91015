import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function BloggsPosts() {
	const [blogPosts, setBlogPosts] = useState([]);

	useEffect(() => {
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
	}, []);

	return (
		<Container className="blogg-container">
			<h1 className="bloggs-heading">Recent Blog Posts</h1>
			<Row className="blog-posts">
				{blogPosts.map((post, index) => (
					<Col key={index} md={6} lg={4} className="mb-4">
						<Card>
							<Card.Body>
								<Card.Title>{post.title}</Card.Title>
								<Card.Text>{post.content}</Card.Text>
							</Card.Body>
							<Card.Footer>
								<small className="text-muted">
									<span className="blog-author">{post.author}</span>
									<span className="blog-date">{post.date}</span>
								</small>
							</Card.Footer>
						</Card>
					</Col>
				))}
				{blogPosts.length === 0 && <p>No blog posts available.</p>}
			</Row>
		</Container>
	);
}
