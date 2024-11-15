// src/components/EditPostModal.jsx
// Desc: A modal component to edit a post

import { Button } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext } from '@contexts';
import { deletePostById, updatePostById } from '@services/api';
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
    const { posts, setPosts, selectedPost, setSelectedPost, refreshPosts } = usePostContext();
    const { showNotification } = useNotificationContext(); // Removed 'hideNotification'

    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [category, setCategory] = useState("Other");
    const [imageUrls, setImageUrls] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const quillRef = useRef(null);

    // **1. Load Existing Post Data into Modal Fields**
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

    // **2. Handle Modal Open/Close State**
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

    // **3. Close Modal and Reset Fields**
    const handleModalClose = () => {
        setPostContent("");
        setPostTitle("");
        setCategory("Other");
        setImageUrls("");
        setSelectedFiles([]);
        setTimeout(() => setSelectedPost(null), 300); // Delay to ensure modal closes first
        togglePrivateModal();
    };

    // **4. Handle Form Submission for Editing Post**
    const handlePostEditSubmit = async (e) => {
        e.preventDefault();
        logger.info("Submitting edited post with content:", postContent);

        const validationErrors = validatePostContent(postContent);
        if (validationErrors) {
            showNotification(validationErrors, "error");
            return;
        }

        // **Determine the Correct Post Identifier (postId or _id)**
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
            formData.append('imageUrls', imageUrls); // If applicable
            // Include other fields like 'tags', 'status', etc., as needed
            selectedFiles.forEach((file, index) => {
                formData.append('images', file, `image${index}`);
            });

            // **Optimistic UI Update**
            const tempPosts = posts.map((p) =>
                (p.postId === postId || p._id === postId)
                    ? {
                        ...p,
                        content: postContent,
                        title: postTitle,
                        category,
                        imageUrls: imageUrls.split(",").map(url => url.trim()).filter(url => url)
                    }
                    : p
            );
            setPosts(tempPosts);

            // **Send Edit Request to Server**
            const updatedPost = await updatePostById(postId, formData);
            logger.info("Post updated successfully:", updatedPost);

            // **Update Posts in Context with Server Response**
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    (p.postId === postId || p._id === postId)
                        ? { ...p, ...updatedPost, imageUrls: updatedPost.imageUrls || [] }
                        : p
                )
            );

            // **Notification After Successful Edit**
            showNotification("Post edited successfully!", "success");

            // **Close the Modal**
            handleModalClose();

            // **Re-fetch Posts to Ensure UI Sync with Server**
            setTimeout(() => {
                refreshPosts();  // Delay to avoid overwriting the optimistic update
            }, 1000);
        } catch (error) {
            logger.error("Failed to edit post:", error);
            showNotification("Failed to edit post. Please try again.", "error");
            // **Optionally Revert Optimistic Update Here if Needed**
        }
    };

    // **5. Handle File Selection for Images**
    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    // **6. Handle Deleting the Post**
    const handleDeletePost = async () => {
        if (!selectedPost || !(selectedPost.postId || selectedPost._id)) {
            showNotification("Invalid post data. Please try again.", "error");
            return;
        }

        const postId = selectedPost.postId || selectedPost._id;

        try {
            await deletePostById(postId);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => !(post.postId === postId || post._id === postId))
            );
            showNotification('Post deleted successfully!', 'success');
            handleModalClose();
        } catch (error) {
            logger.error("Error deleting post:", error);
            showNotification('Failed to delete the post. Please try again.', "error");
        }
    };

    // **7. Configure ReactQuill Modules and Formats**
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
                        {/* **8. TextArea for Post Title** */}
                        <textarea
                            type="text"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Edit your title here..."
                            className="edit-post-modal__title-input mb-3"
                            maxLength={100}
                            required
                        />
                        {/* **9. ReactQuill Editor for Post Content** */}
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

                    {/* **10. Category Selection Dropdown (Same as PostModal.jsx)** */}
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

                    {/* **11. Media Inputs: Image URLs and File Uploads (Same as PostModal.jsx)** */}
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
                                variant="submit" // **Added variant prop**
                            >
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDeletePost}
                                className="button button-delete"
                                variant="delete" // **Added variant prop**
                            >
                                Delete Post
                            </Button>
                            <Button
                                type="button"
                                onClick={handleModalClose}
                                className="button button-secondary"
                                variant="secondary" // **Added variant prop**
                            >
                                Discard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
