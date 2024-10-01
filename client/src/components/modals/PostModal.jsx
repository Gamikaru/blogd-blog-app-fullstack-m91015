import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNotificationContext, usePostContext, usePrivateModalContext, useUser } from "../../contexts";
import Logger from "../../utils/Logger";
import { validatePostContent } from "../../utils/formValidation";

export default function PostModal() {
   const [postContent, setPostContent] = useState(""); // State to hold post content
   const { user } = useUser(); // Get user from UserContext
   const { handleNewPost } = usePostContext(); // Get handleNewPost from PostContext
   const { showModal, togglePrivateModal, modalType } = usePrivateModalContext(); // Modal context
   const { showNotification } = useNotificationContext(); // Notification context

   // Handle the post submission
   const handlePostSubmit = (e) => {
      e.preventDefault();

      // Validate post content
      const validationErrors = validatePostContent(postContent);
      if (validationErrors) {
         showNotification(validationErrors, "error", { top: '40%', left: '50%' });
         return;
      }

      // Call handleNewPost with only content (userId is handled by backend)
      handleNewPost(postContent);
      setPostContent(""); // Reset form content after submission
      togglePrivateModal(); // Close modal using ModalContext
      showNotification("Post submitted successfully!", "success", { top: '40%', left: '50%' });
      Logger.info("Post submitted", { user, postContent });
   };

   return (
      <Modal
         show={showModal && modalType === 'post'}
         onHide={() => togglePrivateModal()}
         centered
         className="post-modal-container"
      >
         <Modal.Header closeButton className="post-modal-header">
            <Modal.Title className="post-modal-title">CREATE A POST</Modal.Title>
         </Modal.Header>

         <Modal.Body className="post-modal-body">
            <Form onSubmit={handlePostSubmit} className="post-form">
               <Form.Group controlId="postContent">
                  <Form.Control
                     as="textarea"
                     rows={3}
                     value={postContent}
                     onChange={(e) => setPostContent(e.target.value)}
                     placeholder="What's on your mind?"
                     className="post-modal-input"
                  />
               </Form.Group>
               <div className="post-modal-submit-container">
                  <Button type="submit" className="post-submit-btn w-100 mt-3">
                     Submit
                  </Button>
               </div>
            </Form>
         </Modal.Body>
      </Modal>
   );
}
