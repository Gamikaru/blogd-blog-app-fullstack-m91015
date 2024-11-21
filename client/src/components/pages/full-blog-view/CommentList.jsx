// src/components/CommentsList.jsx

import { Comment, ErrorBoundary, Spinner } from '@components';
import { useComments } from '@contexts/CommentContext';
import PropTypes from 'prop-types';

const CommentsList = ({ postId }) => {
    const { comments, loadingComments, errorComments } = useComments();

    if (loadingComments) return <Spinner message="Loading comments..." />;
    if (errorComments) return <div className="comments-list__error">Error: {errorComments}</div>;

    const postComments = comments[postId] || [];

    return (
        <ErrorBoundary>
            <div className="comments-list">
                {postComments.length > 0 ? (
                    postComments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))
                ) : (
                    <p className="comments-list__no-comments">No comments yet.</p>
                )}
            </div>
        </ErrorBoundary>
    );
};

CommentsList.propTypes = {
    postId: PropTypes.string.isRequired,
};

export default CommentsList;