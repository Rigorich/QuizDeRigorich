import { useEffect, useState } from 'react';
import API from '../../API';
import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import { useNavigate } from 'react-router-dom';
import QuizEditorFooter from './QuizEditorFooter';
import QuizEditorQuestion from './QuizEditorQuestion';
import '../../styles/QuizEditor.css';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
}

export default function QuizEditor({quiz, setQuiz}: Parameters) {

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [question, setQuestion] = useState<Question | undefined>(quiz.questions[questionIndex]);

  const navigate = useNavigate();

  useEffect(() => {
    setQuestion(quiz.questions[questionIndex]);
  }, [questionIndex]);

  useEffect(() => {
    if (question && quiz.questions[questionIndex]) {
      quiz.questions[questionIndex] = question;
      setQuiz(JSON.parse(JSON.stringify(quiz)));
    }
  }, [question]);

  return (
      <div className='QuizEditorContainer'>
        <div className='QuizEditorHeader'>
          <h1 className='QuizDeRigorich' onClick={() => navigate('/')}>Quiz de Rigorich</h1>
          <input
            className='TextInput'
            placeholder='Enter quiz title'
            value={quiz.title}
            onChange={e => setQuiz({...quiz, title: e.target.value})}
          />
          <button
            className='TextButton QuizEditorSaveButton'
            onClick={() => API.UpdateQuiz(quiz)
              .then(async () => setQuiz(await API.GetQuiz(quiz.id)))
              .then(() => alert('Saved!'))}
          >
            Save
          </button>
        </div>
        { question &&
          <QuizEditorQuestion
            question={question}
            setQuestion={setQuestion}
          />
        }
        <QuizEditorFooter
          quiz={quiz}
          setQuiz={setQuiz}
          questionIndex={questionIndex}
          setQuestionIndex={setQuestionIndex}
        />
      </div>
  );
}