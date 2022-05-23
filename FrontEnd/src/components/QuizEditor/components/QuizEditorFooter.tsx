import { QuestionType } from '../../../models/QuestionType';
import Quiz from '../../../models/Quiz';
import QuizEditorQuestionItem from './QuizEditorFooterItem';
import '../../../styles/QuizEditor.css';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
  questionIndex: number,
  setQuestionIndex: (index: number) => void,
}

export default function QuizEditorFooter({quiz, setQuiz, questionIndex, setQuestionIndex}: Parameters) {

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
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    setQuestionIndex(quiz.questions.length - 1);
  }

  return (
    <div className='QuizEditorFooter'>
      <div className='QuizEditorFooterInner'>
        {quiz.questions.map((q, index) =>
          <div
            className={'QuizEditorFooterElement' + (index === questionIndex ? ' QuizEditorFooterElementSelected' : '')}
            key={Math.random()}
          >
            <QuizEditorQuestionItem
              quiz={quiz}
              setQuiz={setQuiz}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
              myIndex={index}
            />
          </div>
        )}
        <div className='QuizEditorFooterElement'>
          <button 
            className='TextButton QuizEditorFooterNewQuestionButton'
            onClick={AddNewQuestion}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}