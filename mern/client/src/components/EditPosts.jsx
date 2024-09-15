import "../styles/custom_component_styles/edit_posts.scss"; // Assuming this scss file will handle component-specific styles
import React, { useState } from "react";
import { Button, Container, Form, Toast } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function EditPosts({ postId }) {
    const [cookie] = useCookies();
    const navigate = useNavigate();

    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
    });

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);

    function updateEditPosts(value) {
        setEditForm((prev) => ({ ...prev, ...value }));
    }

    async function handleEditPosts(e) {
        const token = cookie.PassBloggs;
        e.preventDefault();
        if (!token) {
            console.error("Token not found");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5050/post/edit/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });
            if (!response.ok) {
                throw new Error(`Failed to update post: ${response.statusText}`);
            }
            const data = await response.json();
            setShowSuccessToast(true);
            setTimeout(() => {
                navigate("/posts");
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            setShowErrorToast(true);
        }
    }

    return (
        <Container className="edit-posts-container">
            <h1>Edit Post</h1>
            <Form onSubmit={handleEditPosts}>
                <Form.Group controlId="editPostTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter post title"
                        value={editForm.title}
                        onChange={(e) => updateEditPosts({ title: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="editPostContent" className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        placeholder="Enter post content"
                        value={editForm.content}
                        onChange={(e) => updateEditPosts({ content: e.target.value })}
                        required
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                    Save Changes
                </Button>
            </Form>

            {/* Success Toast */}
            <Toast
                className="toast toast-success"
                onClose={() => setShowSuccessToast(false)}
                show={showSuccessToast}
                autohide
                delay={3000}
            >
                <Toast.Body>Post updated successfully!</Toast.Body>
            </Toast>

            {/* Error Toast */}
            <Toast
                className="toast toast-error"
                onClose={() => setShowErrorToast(false)}
                show={showErrorToast}
                autohide
                delay={3000}
            >
                <Toast.Body>Failed to update post. Please try again.</Toast.Body>
            </Toast>
        </Container>
    );
}
