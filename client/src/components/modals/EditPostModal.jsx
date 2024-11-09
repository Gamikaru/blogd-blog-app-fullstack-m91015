// EditPostModal.jsx
// Desc: A modal component to edit a post

import { Logger, updatePostById, useNotificationContext, usePostContext, usePrivateModalContext, validatePostContent } from '@components';
import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditPostModal() {
    const { showModal, togglePrivateModal, modalType } = usePrivateModalContext();
    const { posts, setPosts, selectedPost, setSelectedPost, refreshPosts } = usePostContext();
    const { showNotification } = useNotificationContext();

    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [category, setCategory] = useState("Other");
    const [imageUrls, setImageUrls] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const quillRef = useRef(null);

    useEffect(() => {
        if (selectedPost) {
            Logger.info("Setting post content in modal:", selectedPost.content);
            setPostContent(selectedPost.content);
            setPostTitle(selectedPost.title || "");
            setCategory(selectedPost.category || "Other");
            setImageUrls(selectedPost.imageUrls ? selectedPost.imageUrls.join(",") : "");
        } else {
            Logger.warn("Post data is not available for setting content in modal.");
        }
    }, [selectedPost]);

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showModal]);

    const handleModalClose = () => {
        setPostContent("");
        setPostTitle("");
        setCategory("Other");
        setImageUrls("");
        setSelectedFiles([]);
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
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('content', postContent);
            formData.append('category', category);
            if (imageUrls) {
                formData.append('imageUrls', imageUrls);
            }
            selectedFiles.forEach((file, index) => {
                formData.append('images', file, `image${index}`);
            });

            // Optimistic UI Update
            const tempPosts = posts.map((p) => p._id === selectedPost._id ? { ...p, content: postContent, title: postTitle, category, imageUrls: imageUrls.split(",") } : p);
            setPosts(tempPosts);

            const updatedPost = await updatePostById(selectedPost._id, formData);
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

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    // Custom Quill modules config
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    return (
        <Modal
            show={showModal && modalType === 'editPost' && !!selectedPost}
            onHide={handleModalClose}
            centered
            className="edit-post-modal"
            backdrop="static"
            keyboard={false}
        >
            <div className="edit-post-modal__container">
                <div className="edit-post-modal__preview">
                    <Modal.Header closeButton className="edit-post-modal__header" />
                    <Form onSubmit={handlePostEditSubmit} className="edit-post-modal__form" id="edit-post-form">
                        <input
                            type="text"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Edit your title here..."
                            className="edit-post-modal__title-input mb-3"
                            maxLength={100}
                        />
                        <ReactQuill
                            ref={quillRef}
                            value={postContent}
                            onChange={setPostContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Edit your post here..."
                            className="edit-post-modal__editor"
                        />
                    </Form>
                </div>

                <div className="edit-post-modal__sidebar">
                    <h2 className="edit-post-modal__sidebar-title">Edit Post Settings</h2>

                    <div className="toolbar-group toolbar-group__basics">
                        <h6 className="toolbar-group__title">Category</h6>
                        <div className="toolbar-group__content">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="toolbar-input toolbar-input--select"
                            >
                                <option value="Health and Fitness">Health and Fitness</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Technology">Technology</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="toolbar-group toolbar-group__media">
                        <h6 className="toolbar-group__title">Media</h6>
                        <div className="toolbar-group__content">
                            <input
                                type="text"
                                value={imageUrls}
                                onChange={(e) => setImageUrls(e.target.value)}
                                placeholder="Paste image URLs, separated by commas"
                                className="toolbar-input toolbar-input--url"
                            />
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="toolbar-input toolbar-input--file"
                            />
                        </div>
                    </div>

                    {/* Optional: Add additional toolbar groups if needed */}

                    <div className="toolbar-group toolbar-group__actions">
                        <div className="toolbar-group__content">
                            <Button
                                type="submit"
                                className="button button-submit"
                                form="edit-post-form"
                            >
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                onClick={handleModalClose}
                                className="button button-delete"
                            >
                                Discard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}