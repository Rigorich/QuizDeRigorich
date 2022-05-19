import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../API';
import QuizExample from '../examples/QuizExample';
import Quiz from '../models/Quiz';
import '../styles/MainPage.css';

export default function MainPage() {

  const [code, setCode] = useState<string>('');
  const [quizzes, setQuizzes] = useState<Quiz[] | undefined>(undefined);

  const [quizCode, setQuizCode] = useState<string | null>(null);

  async function ReloadQuizzes() {
    await API.GetAllQuizzes().then(data => setQuizzes(data));
  }

  useEffect(() => {
    ReloadQuizzes();
  }, []);

  return (
    <div className='MainPageContainer'>
      {quizCode && <Navigate to={`/quiz/${quizCode}`} />}
      <div className='MainPageJoinSubContainer'>
        <div><h2>Join quiz game</h2></div>
        <div><input className='TextInput' value={code} onChange={e => setCode(e.target.value)} /></div>
        <div><button className='TextButton MainPagePlayButton' onClick={() => setQuizCode(code)}>Play!</button></div>
      </div>
      <div className='MainPageQuizzesSubContainer'>
        <h2>My quizzes</h2>
        <div className='MainPageQuizList'>
        {quizzes
          ? quizzes.map(q =>
            <div className='MainPageQuizRow' key={q.id}>
              <p className='MainPageQuizName'>{q.title}</p>
              <div className='MainPageActionButtonsRow'>
                <button className='MainPageActionButton' onClick={async () => { const quizCode = await API.CreateQuizGame(q.id); setQuizCode(quizCode); }}>▶️️</button>
                <button className='MainPageActionButton' onClick={() => console.log(`Edit ${q.id}`)}>✏️</button>
                <button className='MainPageActionButton' onClick={async () => { await API.DeleteQuiz(q.id); await ReloadQuizzes() }}>❌️</button>
              </div>
            </div>)
          : 'Please stand by...'}
        </div>
        <button className='TextButton MainPageCreateButton' onClick={() => API.CreateQuiz(QuizExample)}>Create new quiz</button>
      </div>
    </div>
  );
}