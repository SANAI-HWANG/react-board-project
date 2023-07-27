import React from 'react';
import { postAction } from './api'; // 또는 원하는 경로에 맞게 설정해야 합니다.

function Recomment({
  idValue,
  selectedParentComment,
  A,
  recommentContent,
  setRecommentContent,
  cancelRecomment,
  handleRecommentSubmit,
  fetchComments,
}) {
  return (
    <div className="recomment-input-wrapper">
      <textarea
        value={recommentContent}
        onChange={(event) => setRecommentContent(event.target.value)}
        placeholder="대댓글을 입력해주세요."
      ></textarea>
      <button
        className="recomment-submit-button"
        onClick={() => {
          postAction('/api/new/recomment', {
            id: idValue,
            parent_id: selectedParentComment,
            author: A,
            comments: recommentContent,
          }).then(() => {
            alert('대댓글이 작성되었습니다.');
            cancelRecomment();
            fetchComments();
          });
        }}
      >
        대댓글 작성
      </button>
      <button className="recomment-cancel-button" onClick={cancelRecomment}>
        취소
      </button>
    </div>
  );
}

export default Recomment;