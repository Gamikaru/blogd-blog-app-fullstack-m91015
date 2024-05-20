import React, { useState } from "react";
import PostModal from "./PostModal"; 

const initialBlogPosts = [
	{
		id: 1,
		user: { first_name: "John", last_name: "Doe" },
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		postDate: "2024-05-20",
	},
	{
		id: 2,
		user: { first_name: "Jane", last_name: "Smith" },
		content:
			"",
		postDate: "",
	},
];
export default function Bloggs() {
	const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
	const [showModal, setShowModal] = useState(false);

	const addBlogPost = (newPost) => {
		setBlogPosts([newPost, ...blogPosts]); 
		setShowModal(false); 
	};
	return (
		<div className="bloggs-container">
			<h1>Bloggs</h1>
			<button onClick={() => setShowModal(true)}>Create Post</button>
			<div className="blog-posts">
				{blogPosts.map((post) => (
					<div key={post.id} className="blog-post">
					</div>
				))}
			</div>
			<PostModal
				show={showModal}
				handleClose={() => setShowModal(false)}
				addPost={addBlogPost}
			/>
		</div>
	);
}
