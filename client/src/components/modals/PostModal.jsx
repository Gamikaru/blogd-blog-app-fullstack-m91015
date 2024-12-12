// src/components/PostModal.jsx

import { Button, InputField, SelectField } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext, useUser } from '@contexts';
import { calculateReadingTime, countWords, logger, validatePostContent } from '@utils';
import { useEffect, useRef, useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import PropTypes from 'prop-types';

export default function PostModal({ onClose }) {
    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [category, setCategory] = useState("Other");
    const [imageUrls, setImageUrls] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { user } = useUser();
    const { addPost } = usePostContext();
    const { showModal, togglePrivateModal, modalType } = usePrivateModalContext();
    const { showNotification } = useNotificationContext();
    const quillRef = useRef(null);
    const titleRef = useRef(null); // Ref for the textarea

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

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'clean']
            ]
        },
        clipboard: {
            matchVisual: false
        }
    };

    const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'];

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validatePostContent(postContent);
        if (validationErrors) {
            showNotification(validationErrors, "error", { top: '40%', left: '50%' });
            return;
        }

        const formData = new FormData();
        formData.append('title', postTitle);
        formData.append('content', postContent);
        formData.append('category', category);
        if (imageUrls) formData.append('imageUrls', imageUrls);
        selectedFiles.forEach((file) => formData.append('images', file));

        try {
            await addPost(formData);
            setPostContent("");
            setPostTitle("");
            setCategory("Other");
            setImageUrls("");
            setSelectedFiles([]);
            togglePrivateModal();
            showNotification("Post submitted successfully!", "success", { top: '40%', left: '50%' });
            logger.info("Post submitted", { user, postContent, postTitle, category, imageUrls, selectedFiles });
        } catch (error) {
            showNotification("Error submitting post.", "error", { top: '40%', left: '50%' });
            logger.error("Error submitting post", { error });
        }
    };

    return (
        <Modal
            show={showModal && modalType === 'post'}
            onHide={onClose}
            centered
            className="post-modal"
            backdropClassName="post-modal__backdrop"
            container={document.body}
        >
            <Modal.Header>
                <Button
                    variant="close"
                    onClick={onClose}
                    aria-label="Close"
                    className="close-button"
                />
            </Modal.Header>
            <SimpleBar style={{ maxHeight: '100%' }} className="post-modal">
                <Form onSubmit={handlePostSubmit} className="post-modal__form" id="post-form">
                    <div className="post-modal__preview">
                        <textarea
                            type="text"
                            value={postTitle}
                            onChange={handlePostTitleChange}
                            placeholder="Write your title here..."
                            className="post-modal__title-textarea"
                            maxLength={100}
                            ref={titleRef} // Attach ref
                        />
                        <ReactQuill
                            ref={quillRef}
                            value={postContent}
                            onChange={setPostContent}
                            modules={modules}
                            formats={formats}
                            className="post-modal__editor"
                        />
                    </div>

                    <SimpleBar style={{ maxHeight: '100%' }} className="post-modal__sidebar">
                        <h2 className="post-modal__title">Create a Post</h2>
                        <div className="toolbar-group toolbar-group__basics">
                            <h6 className="toolbar-group__title">Category</h6>
                            <div className="toolbar-group__content">
                                <SelectField
                                    options={[
                                        "Health and Fitness",
                                        "Lifestyle",
                                        "Technology",
                                        "Philosophy",
                                        "Cooking",
                                        "Art",
                                        "Business & Finance",
                                        "Productivity",
                                        "Music",
                                        "Other"
                                    ]}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="toolbar-input toolbar-input--select"
                                />
                            </div>
                        </div>

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
                                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                                    className="toolbar-input toolbar-input--file"
                                />
                            </div>
                        </div>

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

                        <div className="toolbar-group toolbar-group__meta">
                            <h6 className="toolbar-group__title">Text Analytics</h6>
                            <div className="toolbar-group__content">
                                <span>Reading Time: {calculateReadingTime(postContent)} min</span>
                                <span>Word Count: {countWords(postContent)}</span>
                            </div>
                        </div>

                        <div className="toolbar-group toolbar-group__actions">
                            <div className="toolbar-group__content">
                                <Button
                                    type="submit"
                                    className="button button-submit"
                                    variant="submit"
                                >
                                    Save Post
                                </Button>
                                <Button
                                    type="button"
                                    className="button button-delete"
                                    onClick={togglePrivateModal}
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
}

PostModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};