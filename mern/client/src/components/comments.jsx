import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Comments({ postId, handleLike }) {
	const [cookie, setCookie, removeCookie] = useCookies();
	const [comments, setComments] = useState([]);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		fetchComments();
	}, []);

	const fetchComments = async () => {
		try {
			const response = await fetch(`http://localhost:5050/comments/${postId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookie.PassBloggs}`,
				},
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setComments(data);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	const handleLikeClick = () => {
		setLiked(!liked);
		handleLike();
	};

	return (
		<div>
			{comments.map((comment, index) => (
				<div key={index}>
					<p>{comment.content}</p>
					<Button
						variant={liked ? "success" : "secondary"}
						onClick={handleLikeClick}
					>
						Like
					</Button>
				</div>
			))}
		</div>
	);
}
