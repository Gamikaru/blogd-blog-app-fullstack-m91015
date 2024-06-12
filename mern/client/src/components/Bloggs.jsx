import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function BloggsPosts() {
	const [cookie, setCookie, removeCookie] = useCookies();
	const [blogPosts, setBlogPosts] = useState([]);

	useEffect(() =>{
	fetchBlogPosts();
	});
		const fetchBlogPosts = async () => {
			try {
				const response = await fetch(
					`http://localhost:5050/post/${cookie.userID}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${cookie.PassBloggs}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setBlogPosts(data);
			} catch (error) {
				console.error("Error fetching blog posts:", error);
			}
		};

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
							<Card.Text className="card-text">{post.content}</Card.Text>
						</Card.Body>
						<Card.Footer className="card-footer">
							<small className="text-muted">
								<span className="blog-author">{post.author}</span>
								<span className="blog-date">
									{new Date(post.time_stamp).toLocaleDateString()}
								</span>
							</small>
							<button className="like-button">Like</button>
						</Card.Footer>
						<div className="comments">
							{post.comments.map((comment, commentIndex) => (
								<div key={commentIndex} className="comment">
									<p className="comment-author">{comment.author}</p>
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
