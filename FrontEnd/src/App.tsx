import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import API from './API';
import './App.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import QuizGame from './components/QuizGame/QuizGame';

function App() {

  const [isSignedIn, setIsSignedIn] = useState<boolean>(localStorage.getItem('token') != null);

  return (
    <div className="App">
      <button 
        onClick={async () => alert(await API.Test())}
      >
        Test
      </button>
      <Routes>
        {isSignedIn
        ?
        <>
          <Route path='/' element={<MainPage />} />
          <Route path='/quiz/:quizCode' element={<QuizGame />} />
          <Route path="*" element={<Navigate replace to='/' />} />
        </>
        :
        <>
          <Route path='/login' element={<LoginPage onSuccessLogin={() => setIsSignedIn(true)} />} />
          <Route path="*" element={<Navigate replace to='/login' />} />
        </>
        }
      </Routes>
      
    </div>
  );
}

export default App;
