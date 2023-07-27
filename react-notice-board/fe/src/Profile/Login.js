import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { json, Link, useNavigate } from 'react-router-dom';

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

function Login() {
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')

    let [savedLoginId, setSavedLoginId] = useState("");
    let [savedLoginPassword, setSavedLoginPassword] = useState("");
    let [savedLoginAuthor, setSavedLoginAuthor] = useState("");
    const navigate = useNavigate();

    let sessionStorage = window.sessionStorage;

    // input data 의 변화가 있을 때마다 value 값을 변경해서 useState 해준다
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }

    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    // login 버튼 클릭 이벤트
    const onClickLogin = () => {

        postAction('/api/get/onLogin', {

            user_id: inputId,
            user_pw: inputPw,

        })
            .then(res => {
                console.log("res", res)

                sessionStorage.setItem("loginAuthor", res[0].Author);
                sessionStorage.setItem("loginId", inputId);
                sessionStorage.setItem("loginPassword", inputPw);


                setSavedLoginAuthor(sessionStorage.getItem("loginAuthor"));
                setSavedLoginId(sessionStorage.getItem("loginId"));
                setSavedLoginPassword(sessionStorage.getItem("loginPassword"));
                console.log(sessionStorage)

                window.location.replace('/Board');
            })
    }

    const CreateAccountButton = () => {
        window.location.replace('/CreateAccount');
      };

    useEffect(() => {
    }, [inputId, inputPw])

    return (
        <div className='login-page'>
            <h2>Login</h2>
            <div>
                <label htmlFor='input_id'>ID : </label>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId} />
            </div>
            <div>
                <label htmlFor='input_pw'>PW : </label>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw} />
            </div>
            <br></br>
            <div>
                <button className="login-Page-Button" onClick={onClickLogin}>Login</button>
                <button className="login-Page-Button" onClick={CreateAccountButton}>CreateAccount</button>
                <button className="login-Page-Button" onClick={() => navigate("/")}>Home</button>
            </div>
            {/* <div>
                <button onClick={() => {
                    sessionStorage.clear();
                    setSavedLoginId(sessionStorage.getItem("loginId"));
                    setSavedLoginPassword(sessionStorage.getItem("loginPassword"));
                }}>Logout</button>
                <button onClick={() => {
                    sessionStorage.removeItem("loginId");
                    setSavedLoginId(sessionStorage.getItem("loginId"));
                }}>loginId 삭제</button>
            </div> */}
            {/* <div>
                sessionStorage에 저장된 loginId는 {savedLoginId} 이고 loginPassword는 {savedLoginPassword} 이다.
            </div> */}
            {/* <div>
                {JSON.stringify(sessionStorage)}
            </div> */}
        </div>
    )
}

export default Login;