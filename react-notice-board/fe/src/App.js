import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import LoginLOGO from './LoginLOGO.webp';
import './App.css';
import Debug from './Debug';
import Login from './Profile/Login';
import CreateAccount from './Profile/CreateAccount';
import Board from './Board';
import CreateContent from './CreateContent';
import ContentView from './ContentView';


function App() {
  const [data, setData] = useState("");
  useEffect(() => {
    async function loadData() {
      let response = await (await fetch("/api/main")).json();
      setData(response.response);
    }

    loadData();
  });

  // const loginPageButton = () => {
  //   window.location.replace('/Login');
  // };
  // const CreateAccountButton = () => {
  //   window.location.replace('/CreateAccount');
  // };

  const goToLogin = () => {
    window.location.replace('/Login');
  };



  return (
    <div className="App">
      {/* <div>
        <button className='login-Page-Button' onClick={loginPageButton}>login</button>
        <button className='login-Page-Button' onClick={CreateAccountButton}>CreateAccount</button>
      </div> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <header className="App-header" onClick={goToLogin}>
              <img src={LoginLOGO} className="App-logo" alt="logo" />
              <p>
                {data}
              </p>
            </header>
          }>
          </Route>
          <Route path="/Board" element={
            <Board />
          }>
          </Route>
          <Route path="/CreateContent" element={
            <CreateContent />
          }>
          </Route>
          <Route path="/debug" element={
            <Debug />
          }>
          </Route>
          <Route path="/Login" element={
            <Login/>
          }>
          </Route>
          <Route path="/CreateAccount" element={
            <CreateAccount/>
          }>
          </Route>
          <Route path="/ContentView" element={
            <ContentView/>
          }>
          </Route>

        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;