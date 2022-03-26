// @ts-nocheck

import React from 'react';
import './App.css';

function App() {
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
          onClick={() => 
            fetch(window.config.baseUrl + 'api/Test')
            .then(r => r.text().then(m => alert(m)))}
        >
          Test
        </button>
      </header>
    </div>
  );
}

export default App;
