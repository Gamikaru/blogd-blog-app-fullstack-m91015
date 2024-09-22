import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUser, usePrivateModalContext, usePostContext } from "../../contexts"; // Import UserContext, ModalContext, and PostContext
import Logger from "../../utils/Logger"; // Import Logger

export default function PostModal() {
   const [postContent, setPostContent] = useState(""); // State to hold post content
   const { user } = useUser(); // Get user from UserContext
   const { handleNewPost } = usePostContext(); // Get handleNewPost from PostContext
   const { showModal, togglePrivateModal, modalType } = usePrivateModalContext(); // Get showModal, togglePrivateModal, and modalType from ModalContext

   // Handle the post submission
   const handlePostSubmit = (e) => {
      e.preventDefault();

      if (!postContent.trim()) {
         alert("Post content cannot be empty.");
         return;
      }

      // Call handleNewPost with only content (userId is handled by backend)
      handleNewPost(postContent);
      setPostContent(""); // Reset form content after submission
      togglePrivateModal(); // Close modal using ModalContext
      Logger.info("Post submitted", { user, postContent });
   };

   return (
      <Modal
         show={showModal && modalType === 'post'} // Only show if modalType is 'post'
         onHide={() => togglePrivateModal()} // Close modal on hide
         centered
         className="post-modal-container"
      >
         <Modal.Header closeButton className="post-modal-header">
            <Modal.Title>Create Post</Modal.Title>
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
