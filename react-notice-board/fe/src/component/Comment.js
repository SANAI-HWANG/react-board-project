import React, { useState } from 'react';
import RecommentInput from './RecommentInput';

function Comment({
  comment,
  index,
  handleCommentEdit,
  showRecommentInputUI,
  recommentContent,
  setRecommentContent,
  cancelRecomment,
  handleRecommentSubmit,
  fetchComments,
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [commentEditStates, setCommentEditStates] = useState(comments.map(() => false));
  const [showRecommentInput, setShowRecommentInput] = useState(false);
  const [selectedParentComment, setSelectedParentComment] = useState(null);

  let A = sessionStorage.getItem('loginAuthor');

  return (
    <React.Fragment key={comment.id2}>
      <div class="comment-area">
        <div class="comment-wrapper">
          <div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" />
          </div>
          <div class="comment-container">
            <span class="name-text">{comment.author}</span>

            {commentEditStates[index] ? (
              <>
                <textarea value={editedComment} onChange={(event) => setEditedComment(event.target.value)}></textarea>
                <button
                  onClick={() => {
                    postAction('/api/update/comment', {
                      id2: comment.id2,
                      comments: editedComment,
                      creationDate: comment.creationDate,
                    });
                    handleCommentEdit(index); // 수정 완료 후 상태 변경
                    fetchComments();
                  }}
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <span class="comment-text">
                  {comment.comments}
                  <br></br>
                  <br></br>
                  <button className="comment-button" onClick={() => showRecommentInputUI(comment.id2)}>
                    답글쓰기
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => {
                      handleCommentEdit(index); // 수정 버튼 클릭 시 상태 변경
                      setEditedComment(comment.comments);
                    }}
                  >
                    댓글수정
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => {
                      postAction('/api/delete/comment', { id2: comment.id2 }).then((res) => {
                        console.log(comment);
                        alert('댓글이 삭제되었습니다.');
                        window.location.reload();
                      });
                    }}
                  >
                    삭제
                  </button>
                </span>
              </>
            )}
          </div>
          {showRecommentInput && selectedParentComment === comment.id2 && (
            <RecommentInput
              idValue={idValue}
              selectedParentComment={selectedParentComment}
              A={A}
              recommentContent={recommentContent}
              setRecommentContent={setRecommentContent}
              cancelRecomment={cancelRecomment}
              handleRecommentSubmit={handleRecommentSubmit}
              fetchComments={fetchComments}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Comment;