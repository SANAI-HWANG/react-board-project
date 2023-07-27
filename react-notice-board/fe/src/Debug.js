import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import { json } from 'react-router-dom';


async function postAction(endpoint = "/", request = null){
  if(request == null){
    const response = await fetch(endpoint, {method: "POST"});
    return await response.json(); //입력한 값이 없을때
  }else{
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    return await response.json();
  }
}//입력한 값이 있을때

function Debug() {
  const [selectedApi, setSelectedApi] = useState("getPosts");
  const [log, setLog] = useState("No Response");
  const [posts, setPosts] = useState([]);
  const [dataAuthor, setDataAuthor] = useState("");
  const [dataPassword, setDataPassword] = useState("");
  const [dataTitle, setDataTitle] = useState("");
  const [dataContents, setDataContents] = useState("");


//selectedApi --> e.target.selectedOptions[0].value 로 변하게 한다.
  let apiChanges = (e)=>{
    setSelectedApi(e.target.selectedOptions[0].value);
  }
  
 function titleValue (res){
  let titleValueArr = [];
  for(let i=0;i<res.length;i++){
    titleValueArr.push(res[i].title)
  }
  return titleValueArr
 }
  let execution = (e)=> {
    switch(selectedApi){
      case "getPosts":
        postAction("/api/get/allPosts").then(res => {
          setLog(JSON.stringify(res));
          setPosts(res);
          
        });//setLog가 BE에서의 값들을 보여주는 메세지 역할인듯
        break;
      case "resetPosts":
        postAction("/api/reset/posts").then(res => {
          setLog(res.msg);
        });
        break;
      case "createPosts":
        if(dataAuthor == "" ||
          dataPassword == "" ||
          dataTitle == "" ||
          dataContents == ""){
            setLog("값을 전부 입력해 주세요");
          }else{
            postAction("/api/new/post", {
              title : dataTitle,
              contents : dataPassword,
              author : dataAuthor,
              password : dataContents
            }).then(res => {
              setLog(JSON.stringify(res));
            });
        }
        break;
    }
  }

  
    useEffect(() => {

    });
  return (
    <div className="App">
      <header className="App-header">
        <div className='span-holder'>
          <span>API 종류 :</span>
          <span className='span-contents'>
            <select name="choice"style={{width: "150px"}} onChange={apiChanges}> //이벤트
              <option value="getPosts">Post 가져오기</option>
              <option value="resetPosts">Post DB 초기화</option>
              <option value="createPosts">Post 생성</option>
            </select>
          </span>
        </div>
        {
          selectedApi == "getPosts" && (
            <div>
              <table>
                <thead>
                  <tr>
                    <td>Title</td>
                    <td>Author</td>
                    <td>Author</td>
                    <td>Author</td>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(x=>{
                    return(
                      <tr>
                        <td>{x.title}</td>
                        <td>{x.contents}</td>
                        <td>{x.author}</td>
                        <td>{x.author}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
        {
          selectedApi == "createPosts" && (
            <div>
              <div className='span-holder'>
                <span>작성자</span>
                <span className='span-contents'>
                  <input value={dataAuthor} onChange={(event) => {
                    setDataAuthor(event.target.value);
                  }}></input>
                </span>
              </div>
              <div className='span-holder'>
                <span>비밀번호</span>
                <span className='span-contents'>
                  <input value={dataPassword} onChange={(event) => {
                    setDataPassword(event.target.value);
                  }}></input>
                </span>
              </div>
              <div className='span-holder'>
                <span>제목</span>
                <span className='span-contents'>
                  <input value={dataTitle} onChange={(event) => {
                    setDataTitle(event.target.value);
                  }}></input>
                </span>
              </div>
              <div className='span-holder'>
                <span>내용</span>
                <span className='span-contents'>
                  <textarea value={dataContents} name="Text1" cols="30" rows="5" onChange={(event) => {
                    setDataContents(event.target.value);
                  }}></textarea>
                </span>
              </div>
            </div>
          )
        }
      
        <button onClick={execution}>실행</button>
        <div className='logbox'>
          <p>
            {log}
          </p>

        </div>
      </header>
    </div>
  );
}


export default Debug;