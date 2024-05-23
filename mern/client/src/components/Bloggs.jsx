import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

export default function BloggsPosts() {
	const [blogPosts, setBlogPosts] = useState([
		{
			first_name: "John",
			last_name: "Doe",
			content: "This is the content of the first blog post.",
			author: "John Doe",
			date: "2024-05-01",
		},
		{
			first_name: "Jane",
			last_name: "Smith",
			content: "This is the content of the second blog post.",
			author: "Jane Smith",
			date: "2024-05-02",
		},
		{
			first_name: "Alice",
			last_name: "Johnson",
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
						</Card.Footer>
					</Card>
				))}
				{blogPosts.length === 0 && (
					<p className="no-blog-posts">No blog posts available.</p>
				)}
			</div>
		</Container>
	);
}
