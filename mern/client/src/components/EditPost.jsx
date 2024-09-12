import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Container} from 'react-bootstrap';
import { useCookies } from "react-cookie";

export default function EditPosts() {
    const [cookie, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();
   
    	function updateEditPosts(value) {
		console.log("Updating form field:", value);
		setEditForm((prev) => ({ ...prev, ...value }));
	}

	async function handleEditPosts(e) {
	const token = cookie.PassBloggs;
    e.preventDefault();
    if (!token) {
        console.error("Token not found in localStorage");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5050/post/edit/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(EditPosts),
        });
        if (!response.ok) {
            throw new Error(`Failed to update user data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        // If the response is successful, reset the form fields
        setShowSuccessToast(true);
        navigate("/edit-posts");
    } catch (error) {
        console.error("Error occurred during user update:", error.message);
        alert("Update Post failed. " + error.message);
        setShowErrorToast(true);
    }
}



    return (
        <Container>
            
        </Container>
  );
 }
