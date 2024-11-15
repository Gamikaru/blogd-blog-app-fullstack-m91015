// src/components/EditPostModal.jsx
// Desc: A modal component to edit a post

import { Button } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext } from '@contexts';
import { calculateReadingTime, countWords, logger, validatePostContent } from '@utils';
import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categoryOptions = [
    'Health and Fitness',
    'Lifestyle',
    'Technology',
    'Cooking',
    'Philosophy',
    'Productivity',
    'Art',
    'Music',
    'Business',
    'Business & Finance',
    'Other'
];

export default function EditPostModal() {
    const { showModal, togglePrivateModal, modalType } = usePrivateModalContext();
    const { updatePost, selectedPost, setSelectedPost } = usePostContext();
    const { showNotification } = useNotificationContext();

    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [category, setCategory] = useState("Other");
    const [imageUrls, setImageUrls] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const quillRef = useRef(null);

    useEffect(() => {
        if (selectedPost) {
            logger.info("Setting post content in modal:", selectedPost.content);
            setPostContent(selectedPost.content);
            setPostTitle(selectedPost.title || "");
            setCategory(selectedPost.category || "Other");
            setImageUrls(selectedPost.imageUrls ? selectedPost.imageUrls.join(",") : "");
        } else {
            logger.warn("Post data is not available for setting content in modal.");
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
        logger.info("Submitting edited post with content:", postContent);

        const validationErrors = validatePostContent(postContent);
        if (validationErrors) {
            showNotification(validationErrors, "error");
            return;
        }

        const postId = selectedPost.postId || selectedPost._id;

        if (!selectedPost || !postId) {
            showNotification("Invalid post data. Please try again.", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('content', postContent);
            formData.append('category', category);

            const urlsArray = imageUrls.split(',').map(url => url.trim()).filter(url => url);
            urlsArray.forEach((url) => {
                formData.append('imageUrls', url);
            });

            selectedFiles.forEach((file, index) => {
                formData.append('images', file, `image${index}`);
            });

            const { success, message } = await updatePost(postId, formData);

            if (success) {
                showNotification(message || "Post edited successfully!", "success");
            } else {
                showNotification("Failed to edit post. Please try again.", "error");
            }

            handleModalClose();

        } catch (error) {
            logger.error("Failed to edit post:", error);
            showNotification("Failed to edit post. Please try again.", "error");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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
                        <textarea
                            type="text"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Edit your title here..."
                            className="edit-post-modal__title-input mb-3"
                            maxLength={100}
                            required
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

                    {/* Category Selection */}
                    <div className="toolbar-group toolbar-group__basics">
                        <h6 className="toolbar-group__title">Category</h6>
                        <div className="toolbar-group__content">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="toolbar-input toolbar-input--select"
                                required
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Media Inputs */}
                    <div className="toolbar-group toolbar-group__media">
                        <h6 className="toolbar-group__title">Media</h6>
                        <div className="toolbar-group__content">
                            <input
                                type="text"
                                value={imageUrls}
                                onChange={(e) => setImageUrls(e.target.value)}
                                placeholder="Paste image URLs, separated by commas"
                                className="toolbar-input toolbar-input--url mb-2"
                            />
                            <input
                                type="file"
                                multiple
                                accept="image/*" // **Same as PostModal.jsx**
                                onChange={handleFileChange}
                                className="toolbar-input toolbar-input--file"
                            />
                        </div>
                    </div>

                    {/* **12. Post Settings (Same as PostModal.jsx)** */}
                    <div className="toolbar-group toolbar-group__settings">
                        <h6 className="toolbar-group__title">Post Settings</h6>
                        <div className="toolbar-group__content">
                            <label className="toolbar-checkbox">
                                <input type="checkbox" /> Allow Comments
                            </label>
                            <label className="toolbar-checkbox">
                                <input type="checkbox" /> Featured Post
                            </label>
                            <label className="toolbar-checkbox">
                                <input type="checkbox" /> Schedule Post
                            </label>
                        </div>
                    </div>

                    {/* **13. SEO Settings (Same as PostModal.jsx)** */}
                    <div className="toolbar-group toolbar-group__seo">
                        <h6 className="toolbar-group__title">SEO</h6>
                        <div className="toolbar-group__content">
                            <input
                                type="text"
                                placeholder="Meta Description"
                                className="toolbar-input"
                            />
                            <input
                                type="text"
                                placeholder="Keywords (comma-separated)"
                                className="toolbar-input"
                            />
                        </div>
                    </div>

                    {/* **14. Text Analytics (Same as PostModal.jsx)** */}
                    <div className="toolbar-group toolbar-group__meta">
                        <h6 className="toolbar-group__title">Text Analytics</h6>
                        <div className="toolbar-group__content">
                            <span>Reading Time: {calculateReadingTime(postContent)} min</span>
                            <span>Word Count: {countWords(postContent)}</span>
                        </div>
                    </div>

                    {/* **15. Action Buttons: Save Changes, Delete Post, Discard (Same as PostModal.jsx + Delete Option)** */}
                    <div className="toolbar-group toolbar-group__actions">
                        <div className="toolbar-group__content d-flex justify-content-between">
                            <Button
                                type="submit"
                                className="button button-submit"
                                form="edit-post-form"
                                variant="submit"
                            >
                                Save Changes
                            </Button>

                            <Button
                                type="button"
                                onClick={handleModalClose}
                                className="button button-secondary"
                                variant="close"
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
