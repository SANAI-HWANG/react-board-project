import React, { useState, useEffect } from 'react';
import './ContentView.css';
import Comment from './Comment';
import RecommentInput from './RecommentInput';
import { postAction } from './api'; // Replace with the appropriate path

function ContentView() {
  const [selectedApi, setSelectedApi] = useState('getPosts');
  const [log, setLog] = useState('No Response');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [dataAuthor, setDataAuthor] = useState('');
  const [dataComments, setDataComments] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editMode2, setEditMode2] = useState(false);
  const [editedPostTitle, setEditedPostTitle] = useState('');
  const [editedPostContent, setEditedPostContent] = useState('');
  const [editedPostCreationDate, setEditedPostCreationDate] = useState('');
  const [editedComment, setEditedComment] = useState('');
  const [commentEditStates, setCommentEditStates] = useState([]);
  const [showRecommentInput, setShowRecommentInput] = useState(false);
  const [selectedParentComment, setSelectedParentComment] = useState(null);
  const [recommentContent, setRecommentContent] = useState('');

  let [savedLoginId, setSavedLoginId] = useState('');
  let [savedLoginPassword, setSavedLoginPassword] = useState('');

  let A = sessionStorage.getItem('loginAuthor');

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const [idValue, setIdValue] = useState(id);

  const fetchPosts = async () => {
    const res = await postAction('/api/get/post', { id: parseInt(id) });
    setPosts(res);
    if (dataComments === '') {
      // Do something if dataComments is empty
    } else {
      postAction('/api/new/comment', {
        id: idValue,
        author: A,
        comments: dataComments,
      }).then((res) => {
        alert('잘됐다.');
      });
    }
  };

  const fetchComments = async () => {
    const res = await postAction('/api/get/comment', { id: id });
    setComments(res);
    // Set initial commentEditStates when fetching comments
    setCommentEditStates(res.map(() => false));
  };

  const handleCommentEdit = (index) => {
    setCommentEditStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const showRecommentInputUI = (commentId) => {
    setSelectedParentComment(commentId);
    setShowRecommentInput(true);
  };

  const cancelRecomment = () => {
    setShowRecommentInput(false);
    setSelectedParentComment(null);
    setRecommentContent('');
  };

  const handleRecommentSubmit = () => {
    postAction('/api/new/recomment', {
      id: idValue,
      parent_id: selectedParentComment,
      author: A,
      comments: recommentContent,
    }).then(() => {
      alert('잘됐다.');
      cancelRecomment();
      fetchComments();
    });
  };

  // ... Remaining code remains the same as in the original file ...

  return (
    <>
      <div className="entire">
        {/* ... Remaining code remains the same as in the original file ... */}
        <div className="comment-view-wrapper">
          <hr></hr>
          <div>
            {comments.map((x, index) => (
              <Comment
                key={x.id2}
                comment={x}
                index={index}
                handleCommentEdit={handleCommentEdit}
                showRecommentInputUI={showRecommentInputUI}
                recommentContent={recommentContent}
                setRecommentContent={setRecommentContent}
                cancelRecomment={cancelRecomment}
                handleRecommentSubmit={handleRecommentSubmit}
                fetchComments={fetchComments}
              />
            ))}
          </div>
        </div>
        <br></br>
        <button className="content-view-go-list-btn" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <button className="content-view-go-list-btn" onClick={() => navigate('/Board')}>
          목록으로 돌아가기
        </button>
      </div>
    </>
  );
}

export default ContentView;
