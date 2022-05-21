import { useEffect, useState } from 'react';
import API from '../../API';
import Question from '../../models/Question';
import { QuestionType } from '../../models/QuestionType';
import Quiz from '../../models/Quiz';
import QuizEditorQuestionItem from './QuizEditorQuestionItem';
import '../../styles/QuizEditor.css';
import { useNavigate } from 'react-router-dom';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
}

export default function QuizEditor({quiz, setQuiz}: Parameters) {

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [question, setQuestion] = useState<Question | undefined>(quiz.questions[questionIndex]);

  const navigate = useNavigate();

  useEffect(() => {
    setQuestion(quiz.questions[questionIndex])
  }, [questionIndex]);

  useEffect(() => {
    if (question && quiz.questions[questionIndex]) {
      quiz.questions[questionIndex] = question;
      setQuiz({...quiz});
    }
  }, [question]);

  function AddNewQuestion() {
    quiz.questions.push({
      id: 0,
      priority: null,
      type: QuestionType.Single,
      timeLimitInSeconds: 10,
      text: 'Question?',
      image: null,
      answers: [],
    });
    const clone = JSON.parse(JSON.stringify(quiz));
    setQuiz(clone);
    setQuestionIndex(quiz.questions.length - 1);
  }

  return (
      <div className='QuizEditorContainer'>
        <div className='QuizEditorHeader'>
          <h1 className='QuizDeRigorich' onClick={() => navigate('/')}>Quiz de Rigorich</h1>
          <input
            className='TextInput'
            placeholder='Enter quiz title'
            value={quiz.title}
            onChange={e => setQuiz({...quiz, title: e.target.value})} />
          <button
            className='TextButton QuizEditorSaveButton'
            onClick={() => API.UpdateQuiz(quiz)
              .then(async () => setQuiz(await API.GetQuiz(quiz.id)))
              .then(() => alert('Saved!'))}
          >
            Save
          </button>
        </div>
        <div className='QuizEditorQuestionEditor'>
              
        </div>
        <div className='QuizEditorFooter'>
          <div className='QuizEditorFooterInner'>
            {quiz.questions.map((q, index) =>
              <div className='QuizEditorFooterItem' key={q.id || Math.random()}>
                <QuizEditorQuestionItem
                  quiz={quiz}
                  setQuiz={setQuiz}
                  index={index}
                  setQuestionIndex={setQuestionIndex}
                />
              </div>
            )}
            <div className='QuizEditorFooterItem'>
              <button 
                className='TextButton QuizEditorFooterNewQuestionButton'
                onClick={AddNewQuestion}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}