import React from 'react';
import API from './API';
import './App.css';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

function App() {

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(API.BaseUrl + 'quiz', { accessTokenFactory: () => localStorage.getItem('token') ?? '' })
    .configureLogging(signalR.LogLevel.Trace)
    .build();

  async function startConnection() {
    try {
      await connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.log(err);
      setTimeout(startConnection, 10000);
    }
  };

  connection.onclose(async () => await startConnection());

  startConnection();

  return (
    <div className="App">
      <header className="App-header">
        <img src={
          'https://steamuserimages-a.akamaihd.net/ugc/925960612643321840/D18CD4FC8A345B20B731528AA347C2F1A80DC1AD/'} 
          className="App-logo" 
          alt="logo" />
        <p>
          Someday here will be Quiz <br/>
          But yet, you can press this wunderbar buton!
        </p>
        <button 
          onClick={() => {
            //axios.post(API.BaseUrl + 'api/Register', { Nickname: 'Rigorich', Password: '123456' })
            //  .then(r => alert(r.data));
            API.Register('Rigorich', '123456');
            //fetch(API.BaseUrl + 'api/Test')
            //  .then(r => r.text().then(m => alert(m)));
            //axios.post(API.BaseUrl + 'api/Login', { Nickname: 'Rigorich', Password: '123456' })
            //  .then(r => alert(r.data));
            connection.invoke('CreateQuiz', 42);
          }}
        >
          Test
        </button>
      </header>
    </div>
  );
}

export default App;
