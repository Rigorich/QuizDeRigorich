import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import API from '../../API';
import Quiz from '../../models/Quiz';
import QuizEditor from './QuizEditor';

export default function QuizEditorPage() {

  const { quizIdString } = useParams<{quizIdString: string}>();
  
  const [quizInfo, setQuizInfo] = useState<Quiz | null | undefined>(undefined);

  useEffect(() => {
    if (quizIdString && +quizIdString)
      API.GetQuiz(+quizIdString)
        .then(quiz => setQuizInfo(quiz || null));
    else
      setQuizInfo(null)
  }, []);

  return (
      <>
        { quizInfo === null && <Navigate replace to='/' />}
        { quizInfo && <QuizEditor quiz={quizInfo} setQuiz={setQuizInfo} />}
      </>
  );
}