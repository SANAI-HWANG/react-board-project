import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { json, Link, useNavigate } from 'react-router-dom';
import FileInput from '../FileInput'

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


function CreateAccount() {
    const [log, setLog] = useState("No Response");
    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [inputcheckPw, setInputCheckPw] = useState("");
    const [inputAuthor, setInputAuthor] = useState("");
    const navigate = useNavigate();



    const [img, setImage] = useState(null);

    const onChange = (e) => { }

    const onClick = () => { }

    const [fileReaderThumbnail, setFileReaderThumbnail] = useState();
    const [URLThumbnail, setURLThumbnail] = useState();

    const encodeFile = (fileBlob) => { // FileReader 방식
        const reader = new FileReader();

        if (!fileBlob) return;

        reader.readAsDataURL(fileBlob);

        return new Promise((resolve) => {
            reader.onload = () => {
                const result = reader.result;

                setFileReaderThumbnail(result);

                resolve();
            };
        });
    };

    const createImageURL = (fileBlob) => {  // createObjectURL 방식
        if (URLThumbnail) URL.revokeObjectURL(URLThumbnail);

        const url = URL.createObjectURL(fileBlob);

        setURLThumbnail(url);
    };


    const onImageChange = (e) => {
        const { files } = e.target;

        if (!files || !files[0]) return;

        const uploadImage = files[0];

        createImageURL(uploadImage);
    };

    const fetchPosts = async () => {
        if (inputId == "" ||
            inputPw == "" ||
            inputcheckPw == "" ||
            inputAuthor == "") {
            alert("값을 전부 입력해 주세요");
        } else if (inputPw != inputcheckPw) {
            alert("비밀번호가 일치하지 않습니다.");
        }
        else {
            postAction("/api/get/CreateAccount", {
                user_id: inputId,
                user_pw: inputPw,
                user_checkpw: inputcheckPw,
                Author: inputAuthor,
            }).then(res => {
                alert("잘됐다.");
            }
            );
            window.location.href = '/Login';
        }
    }

    // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }

    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    const handleInputCheckPw = (e) => {
        setInputCheckPw(e.target.value)
    }

    const handleInputAuthor = (e) => {
        setInputAuthor(e.target.value)
    }

    // login 버튼 클릭 이벤트
    const onClickCreateAccount = () => {
        fetchPosts();
    }

    // 페이지 렌더링 후 가장 처음 호출되는 함수
    useEffect(() => {
        // axios.get('/login')
        // .then(res => console.log(res))
        // .catch()
    },
        // 페이지 호출 후 처음 한번만 호출될 수 있도록 [] 추가
    )



    return (
        <div className='login-page'>
            <h2>CreateAccount</h2>


            <div className="main">
                {/* <div className="section">
                    <h1>File Input by FileReader</h1>
                    <div className="image-wrapper">
                        {fileReaderThumbnail ? (
                            <img src={fileReaderThumbnail} alt="thumbnail" />
                        ) : (
                            "이미지 미리보기"
                        )}
                    </div>
                    <FileInput label="File Reader Upload" onChange={onFileReaderChange} />
                </div> */}
                <div className="section">
                    
                    <div className="image-wrapper">
                        {URLThumbnail ? (
                            <img src={URLThumbnail} alt="thumbnail" />
                        ) : (
                            "프로필사진등록 : " 
                        )}
                        <input type="img" onChange={onChange} />
                        <button onClick={onClick}>제출</button>
                    </div>
                    <FileInput label="미리보기" onChange={onImageChange} />
                </div>
            </div>

            <div>
                <label htmlFor='input_id'>ID : </label>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId} />
            </div>
            <div>
                <label htmlFor='input_pw'>PW : </label>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw} />
            </div>
            <div>
                <label htmlFor='input_checkpw'>CheckPW : </label>
                <input type='password' name='input_checkpw' value={inputcheckPw} onChange={handleInputCheckPw} />
            </div>
            <div>
                <label htmlFor='input_author'>이름 : </label>
                <input type='text' name='input_pw' value={inputAuthor} onChange={handleInputAuthor} />
            </div>
            <div>
                <button type='button' onClick={onClickCreateAccount}>CreateAccount</button>
                <br></br>
                <button className="content-view-go-list-btn" onClick={() => navigate("/")}>홈으로</button>
            </div>

        </div>
    )
}

export default CreateAccount;