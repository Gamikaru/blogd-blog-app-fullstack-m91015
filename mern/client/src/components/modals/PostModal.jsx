import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUser, useModalContext, usePostContext } from "../../contexts"; // Import UserContext, ModalContext, and PostContext
import Logger from "../../utils/Logger"; // Import Logger

export default function PostModal() {
   const [postContent, setPostContent] = useState("");
   const { user } = useUser(); // Get user from UserContext
   const { handleNewPost } = usePostContext(); // Use handleNewPost from PostContext
   const { showModal, toggleModal } = useModalContext(); // Use the modal state from ModalContext

   const handlePostSubmit = (e) => {
      e.preventDefault();

      if (!postContent.trim()) {
         alert("Post content cannot be empty.");
         return;
      }

      // Call handleNewPost with only content (userId will be handled by the backend)
      handleNewPost(postContent);
      setPostContent(""); // Reset form content
      toggleModal(); // Close modal using ModalContext
      Logger.info("Post submitted", { user, postContent });
   };

   return (
      <Modal show={showModal} onHide={toggleModal} centered className="post-modal-container">
         <Modal.Header closeButton className="post-modal-header">
            <Modal.Title className="modal-title">Create Post</Modal.Title>
         </Modal.Header>
         <Modal.Body className="post-modal-body">
            <Form onSubmit={handlePostSubmit} className="post-form">
               <Form.Group controlId="postContent">
                  <Form.Label>Post Content</Form.Label>
                  <Form.Control
                     as="textarea"
                     rows={3}
                     value={postContent}
                     onChange={(e) => setPostContent(e.target.value)}
                     placeholder="What's on your mind?"
                     className="post-modal-input"
                  />
               </Form.Group>
               <Button type="submit" className="post-submit-btn w-100 mt-3">
                  Submit
               </Button>
            </Form>
         </Modal.Body>
      </Modal>
   );
}
