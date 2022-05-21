import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import API from './API';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import QuizEditorPage from './components/QuizEditor/QuizEditorPage';
import QuizGame from './components/QuizGame/QuizGame';
import './index.css';

function App() {

  const [isSignedIn, setIsSignedIn] = useState<boolean>(localStorage.getItem('token') != null);

  return (
    <main className="App">
      <button style={{display: 'none'}} onClick={async () => alert(await API.Test())}>Test</button>
      <Routes>
        {isSignedIn
        ?
        <>
          <Route path='/' element={<MainPage />} />
          <Route path='/quiz/:quizCode' element={<QuizGame />} />
          <Route path='/editor/:quizIdString' element={<QuizEditorPage />} />
          <Route path="*" element={<Navigate replace to='/' />} />
        </>
        :
        <>
          <Route path='/login' element={<LoginPage onSuccessLogin={() => setIsSignedIn(true)} />} />
          <Route path="*" element={<Navigate replace to='/login' />} />
        </>
        }
      </Routes>
    </main>
  );
}

export default App;
