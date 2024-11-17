// components/pages/profile/PostCard.jsx

import { useState } from 'react';
import { Button } from '@components';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ProfilePostCard = ({ post, isOwnProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedContent(post.content);
    };

    const handleEditSubmit = () => {
        // Implement the logic to submit the edited post content
        // For example, make an API call to update the post
        console.log('Edited Content:', editedContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        // Implement the logic to delete the post
        // For example, make an API call to delete the post
        console.log('Delete Post:', post.id);
        setIsDeleting(true);
    };

    return (
        <div className="post-container">
            <div className="speech-bubble">
                {isEditing ? (
                    <textarea
                        className="post-text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                ) : (
                    <div className="post-text">{post.content}</div>
                )}
            </div>
            <div className="post-info">
                <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
                {isOwnProfile && (
                    <div className="action-buttons">
                        {isEditing ? (
                            <Button className="button" onClick={handleEditSubmit}>
                                Save
                            </Button>
                        ) : (
                            <Button className="button" onClick={handleEditToggle}>
                                <FiEdit className="icon" /> Edit
                            </Button>
                        )}
                        <Button className="button" onClick={handleDelete} disabled={isDeleting}>
                            <FiTrash2 className="icon" /> Delete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePostCard;
