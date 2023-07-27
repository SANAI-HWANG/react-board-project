import React, { useState, useEffect } from 'react';
import './App.css';
import { json, Link } from 'react-router-dom';

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

function Board() {
  const [selectedApi, setSelectedApi] = useState("getPosts");
  const [log, setLog] = useState("No Response");
  const [posts, setPosts] = useState([]);
  const [idValue, setIdValue] = useState();
  let [savedLoginId, setSavedLoginId] = useState("");
  let [savedLoginPassword, setSavedLoginPassword] = useState("");




  const fetchPosts = async () => {
    const res = await postAction("/api/get/allPosts");

    setLog(JSON.stringify(res));
    setPosts(res);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  function CreateContents() {
    window.location.href = '/CreateContent';

  };

  const sortedPosts = posts.sort((a, b) => a.id - b.id);

  return (
    <div className="App">
      <button className="logout-button" onClick={() => {
        sessionStorage.clear();
        setSavedLoginId(sessionStorage.getItem("loginId"));
        setSavedLoginPassword(sessionStorage.getItem("loginPassword"));
        window.location.replace('/Login');
      }}>Logout</button>
      <header className="App-header">
        <h1>게시판 목록</h1>
        <button onClick={CreateContents}>작성하기</button>
        <br></br>
        <table>
          <thead>
            <tr>
              <td>글번호</td>
              <td>제목</td>
              <td>작성자</td>
              <td>작성일</td>
              <td>조회수</td>
              <td>글 삭제</td>
            </tr>
          </thead>
          <tbody>
            {sortedPosts.map((x, index) => (
              <tr key={index}>
                <td id="id">{x.id}</td>
                <td>
                <a href={"/ContentView?id=" + x.id} onClick={()=>postAction("/api/view/post",{
                    id: x.id,
                    view: x.view
                  })}>{x.title}</a>
                </td>
                <td>{x.author}</td>
                <td>{x.creationDate}</td>
                <td>{x.view}</td>
                <td id="id" className="td-button">
                  <button onClick={function () {
                    postAction("/api/delete/content", { id: x.id }).then(res => {
                      setIdValue(res.msg)
                      console.log(x)
                      alert("게시글이 삭제되었습니다.");
                      window.location.replace('/Board');
                    })
                  }}>삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default Board;
