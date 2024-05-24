import React, { useState } from "react";
import { Button } from "react-bootstrap";

export default function Comments({ comments, handleLike }) {
	const [liked, setLiked] = useState(false);

	const handleLikeClick = () => {
		setLiked(!liked);
		handleLike();
	};

	return (
		<div>
			{comments.map((comment, index) => (
				<div key={index}>
					<p>{comment.text}</p>
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
