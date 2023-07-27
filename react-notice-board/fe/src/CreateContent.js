import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { json, useNavigate } from 'react-router-dom';

async function postAction(endpoint = "/", request = null) {
    if (request != null) {
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

function CreateContent() {
    const [log, setLog] = useState("No Response");
    const [dataAuthor, setDataAuthor] = useState("");
    const [dataPassword, setDataPassword] = useState("");
    const [dataTitle, setDataTitle] = useState("");
    const [dataContents, setDataContents] = useState("");
    let [savedLoginAuthor, setSavedLoginAuthor] = useState("");
    const navigate = useNavigate();



    let A = sessionStorage.getItem("loginAuthor");
    let B = sessionStorage.getItem("loginPassword");
    // console.log("a", A)

    const fetchPosts = async () => {
        if (
            dataTitle == "" ||
            dataContents == "") {
            alert("값을 전부 입력해 주세요");
        } else {
            postAction("/api/new/post", {
                
                author: A,
                password: B,
                title: dataTitle,
                contents: dataContents,


            }).then(res => {
                alert("잘됐다.");
            }
            );
            window.location.href = '/Board';
        }
    }


    const handleButtonClick = () => {
        fetchPosts();

    };

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <h1>글 작성</h1>
                    {/* <div className='span-holder'>
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
                    </div> */}
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
                <br></br>
                <button onClick={handleButtonClick}>작성</button>
                <br></br>
                <button className="" onClick={() => navigate(-1)}>뒤로가기</button>
            </header>
        </div>
    );
}


export default CreateContent;
