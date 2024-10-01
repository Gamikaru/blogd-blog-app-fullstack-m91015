import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNotificationContext, usePostContext, usePrivateModalContext } from "../../contexts";
import { updatePostById } from "../../services/api/PostService";
import Logger from "../../utils/Logger";
import { validatePostContent } from "../../utils/formValidation";

export default function EditPostModal() {
   const { showModal, togglePrivateModal, modalType } = usePrivateModalContext();
   const { posts, setPosts, selectedPost, setSelectedPost, refreshPosts } = usePostContext();  // <--- Add `posts`
   const { showNotification } = useNotificationContext();

   const [postContent, setPostContent] = useState("");

   useEffect(() => {
      if (selectedPost) {
         Logger.info("Setting post content in modal:", selectedPost.content);
         setPostContent(selectedPost.content);
      } else {
         Logger.warn("Post data is not available for setting content in modal.");
      }
   }, [selectedPost]);

   const handleModalClose = () => {
      setPostContent("");
      setTimeout(() => setSelectedPost(null), 300);
      togglePrivateModal();
   };

   const handlePostEditSubmit = async (e) => {
      e.preventDefault();
      Logger.info("Submitting edited post with content:", postContent);

      const validationErrors = validatePostContent(postContent);
      if (validationErrors) {
         showNotification(validationErrors, "error");
         return;
      }

      if (!selectedPost || !selectedPost._id) {
         showNotification("Invalid post data. Please try again.", "error");
         return;
      }

      try {
         // Optimistic UI Update
         const tempPosts = posts.map((p) => p._id === selectedPost._id ? { ...p, content: postContent } : p); // <-- Update here
         setPosts(tempPosts);  // <--- Ensure posts are updated optimistically

         const updatedPost = await updatePostById(selectedPost._id, { content: postContent });
         Logger.info("Post updated successfully:", updatedPost);

         setPosts((prevPosts) =>
            prevPosts.map((p) =>
               p._id === updatedPost._id ? { ...p, ...updatedPost } : p
            )
         );

         // Notification after post update
         showNotification("Post edited successfully!", "success");

         // Close the modal
         handleModalClose();

         // Re-fetch posts to ensure UI sync with server
         setTimeout(() => {
            refreshPosts();  // Delay the refresh to avoid overwriting the optimistic update
         }, 1000);
      } catch (error) {
         showNotification("Failed to edit post. Please try again.", "error");
      }
   };

   return (
      <Modal show={showModal && modalType === 'editPost' && !!selectedPost} onHide={handleModalClose} centered className="edit-post-modal-container">
         <Modal.Header closeButton className="edit-post-modal-header">
            <Modal.Title className="edit-post-modal-title">Edit Your Post</Modal.Title>
         </Modal.Header>
         <Modal.Body className="edit-post-modal-body">
            {selectedPost ? (
               <Form onSubmit={handlePostEditSubmit} className="edit-post-form">
                  <Form.Group controlId="editPostContent">
                     <Form.Control
                        as="textarea"
                        rows={3}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Edit your post here"
                        className="edit-post-textarea"
                     />
                  </Form.Group>
                  <div className="edit-post-modal-submit-container">
                     <Button type="submit" className="edit-post-submit-btn">
                        Save Changes
                     </Button>
                  </div>
               </Form>
            ) : (
               <p>Loading post data...</p>
            )}
         </Modal.Body>
      </Modal>
   );
}
