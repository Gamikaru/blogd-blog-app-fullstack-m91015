// PostModal.jsx
import { Button } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext, useUser } from '@contexts';
import { calculateReadingTime, countWords, logger, validatePostContent } from '@utils';
import { useRef, useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function PostModal() {
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

    // Custom Quill modules config
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
        selectedFiles.forEach((file) => formData.append('images', file)); // Ensure 'images' field

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
            onHide={togglePrivateModal}
            centered
            className="post-modal"
            backdropClassName="post-modal__backdrop"
            container={document.body}
        >
            <Form onSubmit={handlePostSubmit} className="post-modal__form" id="post-form">
                <div className="post-modal__preview">
                    <Modal.Header closeButton />
                    <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Write your title here..."
                        className="post-modal__title-input"
                        maxLength={100}
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

                <div className="post-modal__sidebar">
                    <h2 className="post-modal__title">Create a Blog</h2>
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
                                <option value="Philosophy">Philosophy</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Art">Art</option>
                                <option value="Business & Finance">Business & Finance</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Music">Music</option>
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
                                placeholder="Paste image URLs"
                                className="toolbar-input toolbar-input--url"
                            />
                            <input
                                type="file"
                                multiple
                                accept="image/*" // Ensure only images can be selected
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
                </div>
            </Form>
        </Modal>
    );
}
