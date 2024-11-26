// src/components/EditPostModal.jsx

import { Button, InputField, SelectField } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext } from '@contexts';
import { calculateReadingTime, countWords, logger, validatePostContent } from '@utils';
import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const categoryOptions = [
    { value: 'Health and Fitness', label: 'Health and Fitness' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Productivity', label: 'Productivity' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Business', label: 'Business' },
    { value: 'Business & Finance', label: 'Business & Finance' },
    { value: 'Other', label: 'Other' },
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
    const titleRef = useRef(null); // Ref for the textarea

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

    useEffect(() => {
        if (titleRef.current) {
            adjustTextareaHeight();
        }
    }, [postTitle]);

    const adjustTextareaHeight = () => {
        const textarea = titleRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
        }
    };

    const handlePostTitleChange = (e) => {
        setPostTitle(e.target.value);
        adjustTextareaHeight();
    };

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
            showNotification(validationErrors, "error", { top: '40%', left: '50%' });
            return;
        }

        const postId = selectedPost.postId || selectedPost._id;

        if (!selectedPost || !postId) {
            showNotification("Invalid post data. Please try again.", "error", { top: '40%', left: '50%' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('content', postContent);
            formData.append('category', category);

            const urlsArray = imageUrls.split(',').map(url => url.trim()).filter(url => url);
            formData.append('imageUrls', urlsArray.join(','));

            selectedFiles.forEach((file) => {
                formData.append('images', file, file.name);
            });

            const { success, message } = await updatePost(postId, formData);

            if (success) {
                showNotification(message || "Post edited successfully!", "success", { top: '40%', left: '50%' });
            } else {
                showNotification("Failed to edit post. Please try again.", "error", { top: '40%', left: '50%' });
            }

            handleModalClose();

        } catch (error) {
            logger.error("Failed to edit post:", error);
            showNotification("Failed to edit post. Please try again.", "error", { top: '40%', left: '50%' });
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
            backdropClassName="edit-post-modal__backdrop"
            container={document.body}
        >
            <SimpleBar style={{ maxHeight: '100%' }} className="edit-post-modal">
                <Form onSubmit={handlePostEditSubmit} className="edit-post-modal__form" id="edit-post-form">
                    <div className="edit-post-modal__preview">
                        <Modal.Header closeButton />
                        <textarea
                            type="text"
                            value={postTitle}
                            onChange={handlePostTitleChange}
                            placeholder="Write your title here..." // Matched PostModal.jsx
                            className="edit-post-modal__title-textarea"
                            maxLength={100}
                            ref={titleRef} // Attach ref
                            required
                        />
                        <div className="edit-post-modal__title-separator" />
                        <ReactQuill
                            ref={quillRef}
                            value={postContent}
                            onChange={setPostContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Edit your post here..."
                            className="edit-post-modal__editor"
                        />
                    </div>

                    <SimpleBar style={{ maxHeight: '100%' }} className="edit-post-modal__sidebar">
                        <h2 className="edit-post-modal__sidebar-title">Edit Your Post</h2>

                        {/* Category Selection */}
                        <div className="toolbar-group toolbar-group__basics">
                            <h6 className="toolbar-group__title">Category</h6>
                            <div className="toolbar-group__content">
                                <SelectField
                                    options={categoryOptions}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="toolbar-input--select"
                                    required
                                />
                            </div>
                        </div>

                        {/* Media Inputs */}
                        <div className="toolbar-group toolbar-group__media">
                            <h6 className="toolbar-group__title">Media</h6>
                            <div className="toolbar-group__content">
                                <InputField
                                    type="text"
                                    value={imageUrls}
                                    onChange={(e) => setImageUrls(e.target.value)}
                                    placeholder="Paste image URLs"
                                    className="toolbar-input toolbar-input--url"
                                />
                                <InputField
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="toolbar-input toolbar-input--file"
                                />
                            </div>
                        </div>

                        {/* Post Settings */}
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

                        {/* SEO Settings */}
                        <div className="toolbar-group toolbar-group__seo">
                            <h6 className="toolbar-group__title">SEO</h6>
                            <div className="toolbar-group__content">
                                <InputField
                                    type="text"
                                    placeholder="Meta Description"
                                    className="toolbar-input"
                                />
                                <InputField
                                    type="text"
                                    placeholder="Keywords (comma-separated)"
                                    className="toolbar-input"
                                />
                            </div>
                        </div>

                        {/* Text Analytics */}
                        <div className="toolbar-group toolbar-group__meta">
                            <h6 className="toolbar-group__title">Text Analytics</h6>
                            <div className="toolbar-group__content">
                                <span>Reading Time: {calculateReadingTime(postContent)} min</span>
                                <span>Word Count: {countWords(postContent)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/* Action Buttons */}
                        <div className="toolbar-group toolbar-group__actions">
                            <div className="toolbar-group__content">
                                <Button
                                    type="submit"
                                    className="button button-submit"
                                    variant="submit"
                                >
                                    Save Changes
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="button button-delete"
                                    variant="delete"
                                >
                                    Discard
                                </Button>
                            </div>
                        </div>
                    </SimpleBar>
                </Form>
            </SimpleBar>
        </Modal>
    );
};