import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Comments({ comments, handleLike }) {
	const [cookie, setCookie, removeCookie] = useCookies();
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
