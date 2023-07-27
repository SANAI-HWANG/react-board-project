import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { json, useNavigate } from 'react-router-dom';
import axios from 'axios';


async function postAction(endpoint = "/", request = null) {
    if (request == null) {
        const response = await fetch(endpoint, { method: "POST" });
        return await response.json(); // 입력한 값이 없을 때
    } else {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });
        return await response.json(); // 입력한 값이 없을 때
    }
}

function ContentView() {
    const [selectedApi, setSelectedApi] = useState("getPosts");
    const [log, setLog] = useState("No Response");
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [dataAuthor, setDataAuthor] = useState("");
    const [dataComments, setDataComments] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [editMode2, setEditMode2] = useState(false);
    const [editedPostTitle, setEditedPostTitle] = useState('');
    const [editedPostContent, setEditedPostContent] = useState('');
    const [editedPostCreationDate, setEditedPostCreationDate] = useState('');
    const [editedComment, setEditedComment] = useState('');
    const [commentEditStates, setCommentEditStates] = useState(comments.map(() => false));
    const [showRecommentInput, setShowRecommentInput] = useState(false);
    const [selectedParentComment, setSelectedParentComment] = useState(null);
    const [recommentContent, setRecommentContent] = useState('');

    let [savedLoginId, setSavedLoginId] = useState("");
    let [savedLoginPassword, setSavedLoginPassword] = useState("");

    let A = sessionStorage.getItem("loginAuthor");

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    // const id2 = urlParams.get("id2");
    const [idValue, setIdValue] = useState(id);
    // const [id2Value, setId2Value] = useState(id2);
    
    const navigate = useNavigate();
    // console.log("id2", id)
    

    const fetchPosts = async () => {
        const res = await postAction("/api/get/post", { id: parseInt(id) });
        setPosts(res);
        if (
            dataComments == "") {

        } else {
            postAction("/api/new/comment", {
                id: idValue,
                author: A,
                comments: dataComments,
            }).then(res => {
                alert("잘됐다.");
            }
            );
        }
    };

    const fetchComments = async () => {
        const res = await postAction("/api/get/comment", { id: id });
        setComments(res);

    };

    const fetchReComments = async () => {
        const res = await postAction("/api/get/recomment", { id: id });
        setComments(res);

    };

    const Createcomment = () => {
        fetchPosts();
        window.location.reload();


    };

    useEffect(() => {
        fetchPosts();
        fetchComments();

    }, [id]);

    const handleCommentEdit = (index) => {
        setCommentEditStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    // 대댓글 작성 UI를 보여주는 함수
    const showRecommentInputUI = (commentId) => {
        setSelectedParentComment(commentId);
        setShowRecommentInput(true);
    };

    // 대댓글 작성 취소 함수
    const cancelRecomment = () => {
        setShowRecommentInput(false);
        setSelectedParentComment(null);
        setRecommentContent('');
    };

    // 대댓글 작성 처리 함수
    const handleRecommentSubmit =() => {
         postAction('/api/new/recomment', {
            id: idValue,
            // id2: id2Value,
            parent_id: selectedParentComment,
            author: A,
            comments: recommentContent,
        }).then(() => {
            alert("잘됐다.");
            cancelRecomment();
            fetchComments();
        }
        );

    };

    // 특정 댓글의 대댓글(recomment)을 가져오는 함수
    const getRecommentsForComment = (commentId) => {
        return comments.filter((comment) => comment.parent_id === commentId);
    };

    // 특정 댓글의 대댓글(recomment)을 렌더링하는 함수
    const renderRecomments = (commentId) => {
        const recomments = getRecommentsForComment(commentId);
        return recomments.map((recomment) => (
            <div key={recomment.id2} className="recomment-wrapper">
                <div className="recomment-container">
                    <span className="name-text">{recomment.author}</span>
                    <span className="comment-text">{recomment.comments}</span>
                    {/* 필요한 경우 대댓글 수정 또는 삭제 버튼 추가 */}
                </div>
            </div>
        ));
    };




    return (

        <>
            <div class="entire">
                <div class="profile-wrapper">
                    <div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" />
                    </div>
                    <div class="profilet-container">
                        <span class="name-text">
                            <br></br>
                            {A} 님 안녕하세요
                            <button className="logout-button" onClick={() => {
                                sessionStorage.clear();
                                setSavedLoginId(sessionStorage.getItem("loginId"));
                                setSavedLoginPassword(sessionStorage.getItem("loginPassword"));
                                window.location.replace('/Login');
                            }}>Logout</button>
                        </span>

                    </div>
                </div>


                <h2 align="center">게시글 상세정보</h2>

                <div className="content-view-wrapper">
                    {
                        posts.map(x => {
                            console.log(posts)
                            return (
                                <React.Fragment key={x.id}>
                                    <hr></hr>
                                    <div className="content-view-row">
                                        <label>게시글 번호</label>
                                        <label>{x.id}</label>
                                    </div>
                                    <div className="content-view-row">
                                        <label>작성자</label>
                                        <label>{x.author}</label>
                                    </div>
                                    <div className="content-view-row">
                                        <label>작성일</label>
                                        <div>
                                            {editMode ? (
                                                <input
                                                    value={editedPostCreationDate}
                                                    onChange={(event) => setEditedPostCreationDate(event.target.value)}
                                                />
                                            ) : (
                                                <label>{x.creationDate}</label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="content-view-row">
                                        <label>조회수</label>
                                        <label>{x.view}</label>
                                    </div>
                                    <div className="content-view-row">
                                        <label>제목</label>
                                        <div>
                                            {editMode ? (
                                                <input
                                                    value={editedPostTitle}
                                                    onChange={(event) => setEditedPostTitle(event.target.value)}
                                                />
                                            ) : (
                                                <label>{x.title}</label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="content-view-row">

                                        <label>내용</label>
                                        <div>
                                            {editMode ? (
                                                <>
                                                    <textarea
                                                        value={editedPostContent}
                                                        onChange={(event) => setEditedPostContent(event.target.value)}
                                                    ></textarea>
                                                    <button onClick={() => {
                                                        postAction("/api/update/post", {
                                                            id: x.id,
                                                            title: editedPostTitle,
                                                            contents: editedPostContent,
                                                            creationDate: editedPostCreationDate
                                                        });
                                                        setEditMode(false);
                                                        fetchPosts();
                                                    }}>저장</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div>{x.contents}</div>
                                                    <br></br><br></br>
                                                    <div>
                                                        <button onClick={() => {
                                                            setEditMode(!editMode);
                                                            setEditedPostTitle(x.title);
                                                            setEditedPostContent(x.contents);
                                                            setEditedPostCreationDate(x.creationDate);
                                                        }}>수정</button>
                                                        <button
                                                            onClick={() => {
                                                                postAction("/api/delete/content", { id: x.id }).then(res => {
                                                                    setIdValue(res.msg)
                                                                    console.log(x)
                                                                    alert("게시글이 삭제되었습니다.");
                                                                    window.location.replace('/Board');
                                                                })
                                                            }}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    <hr></hr>
                                    <div class="createComent-wrapper">
                                        <div>
                                            <div>

                                            </div>
                                            <br></br>
                                            <div className='span-holder'>
                                                <span>내용</span>
                                                <span className='span-comments'>
                                                    <textarea value={dataComments} name="Text1" cols="70" rows="5" onChange={(event) => {
                                                        setDataComments(event.target.value);
                                                    }}></textarea>
                                                    <button className='span-comments' onClick={Createcomment}>댓글달기</button>
                                                </span>
                                            </div>
                                            <div className='span-none'>
                                                {idValue}
                                            </div>

                                        </div>

                                    </div>
                                </React.Fragment>
                            )
                        })

                    }
                    <div className="comment-view-wrapper">
                        <hr></hr>
                        <div>
                            {
                                comments.map((x, index) => {
                                    return (
                                        <React.Fragment key={x.id}>
                                            <div class="comment-area">
                                                <div class="comment-wrapper">
                                                    <div>
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" />
                                                    </div>
                                                    <div class="comment-container">
                                                        <span class="name-text">
                                                            {x.author}
                                                        </span>

                                                        {commentEditStates[index] ? (
                                                            <>
                                                                <textarea
                                                                    value={editedComment}
                                                                    onChange={(event) => setEditedComment(event.target.value)}
                                                                ></textarea>
                                                                <button onClick={() => {
                                                                    postAction("/api/update/comment", {
                                                                        id2: x.id2,
                                                                        comments: editedComment,
                                                                        creationDate: x.creationDate
                                                                    });
                                                                    handleCommentEdit(index); // 수정 완료 후 상태 변경
                                                                    fetchComments();
                                                                }}>저장</button>
                                                            </>
                                                        ) : (
                                                            <>

                                                                < span class="comment-text">
                                                                    {x.comments}
                                                                    <br></br><br></br>
                                                                    <button className="comment-button" onClick={() => showRecommentInputUI(x.id2)}>답글쓰기</button>
                                                                    <button className="comment-button" onClick={() => {
                                                                        handleCommentEdit(index); // 수정 버튼 클릭 시 상태 변경
                                                                        setEditedComment(x.comments)
                                                                    }}>댓글수정</button>
                                                                    <button className="comment-button" onClick={function () {
                                                                        postAction("/api/delete/comment", { id2: x.id2 }).then(res => {
                                                                            // setId2Value(res.msg)
                                                                            console.log(x)
                                                                            alert("댓글이 삭제되었습니다.");
                                                                            window.location.reload();
                                                                        })
                                                                    }}>삭제</button>
                                                                </span>
                                                            </>
                                                        )}

                                                    </div>
                                                    {showRecommentInput && selectedParentComment === x.id2 && (
                                                        <div className="recomment-input-wrapper">
                                                            <textarea
                                                                value={recommentContent}
                                                                onChange={(event) => setRecommentContent(event.target.value)}
                                                                placeholder="대댓글을 입력해주세요."
                                                            ></textarea>
                                                            <button className="recomment-submit-button" onClick={() => {
                                                                    postAction("/api/new/recomment", {
                                                                        id: x.id,
                                                                        id2: x.id2,
                                                                        author: A,
                                                                        recomments: recommentContent,
                                                                        
                                                                    })
                                                                    //renderRecomments();
                                                                    //handleCommentEdit(index); // 수정 완료 후 상태 변경
                                                                    fetchComments();
                                                                }}>
                                                                대댓글 작성
                                                            </button>
                                                            <button className="recomment-cancel-button" onClick={cancelRecomment}>
                                                                취소
                                                            </button>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                        </div>
                    </div>
                    <br></br>
                    <button className="content-view-go-list-btn" onClick={() => navigate(-1)}>뒤로가기</button>
                    <button className="content-view-go-list-btn" onClick={() => navigate("/Board")}>목록으로 돌아가기</button>
                </div >
            </div>
        </>

    );

}


export default ContentView;