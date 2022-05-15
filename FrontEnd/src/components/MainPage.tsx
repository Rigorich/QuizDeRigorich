import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../API';
import QuizExample from '../examples/QuizExample';
import Quiz from '../models/Quiz';

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
    <>
      {quizCode && <Navigate replace to={`/quiz/${quizCode}`} />}
      <div>
        <h2>Join quiz game</h2>
        <input value={code} onChange={e => setCode(e.target.value)} />
        <button onClick={() => setQuizCode(code)}>Play!</button>
      </div>
      <div>
        <h2>My quizzes</h2>
        {quizzes
          ? quizzes.map(q =>
            <div key={q.id}>
              <p>{q.title}</p>
              <button onClick={async () => { const quizCode = await API.CreateQuizGame(q.id); setQuizCode(quizCode); }}>▶️️</button>
              <button onClick={() => console.log(`Edit ${q.id}`)}>✏️</button>
              <button onClick={async () => { await API.DeleteQuiz(q.id); await ReloadQuizzes() }}>❌️</button>
            </div>)
          : 'Please stand by...'}
        <button onClick={() => API.CreateQuiz(QuizExample)}>Create new quiz</button>
      </div>
    </>
  );
}