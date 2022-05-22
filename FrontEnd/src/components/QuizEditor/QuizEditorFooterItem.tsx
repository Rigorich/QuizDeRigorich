import Question from '../../models/Question';
import Quiz from '../../models/Quiz';
import '../../styles/QuizEditorFooterItem.css';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
  questionIndex: number,
  setQuestionIndex: (index: number) => void,
  myIndex: number,
}

export default function QuizEditorFooterItem({quiz, setQuiz, questionIndex, setQuestionIndex, myIndex}: Parameters) {

  const question = quiz.questions[myIndex];

  function SwapQuestions(first: number, second: number) {
    const tmp = quiz.questions[first];
    quiz.questions[first] = quiz.questions[second];
    quiz.questions[second] = tmp;
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    if (questionIndex === first)
      setQuestionIndex(second);
    else
    if (questionIndex === second)
      setQuestionIndex(first);
  }

  function CopyQuestion() {
    const questionCopy = JSON.parse(JSON.stringify(quiz.questions[myIndex])) as Question;
    questionCopy.id = 0;
    questionCopy.answers.forEach(a => a.id = 0);

    quiz.questions.push(questionCopy);
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    setQuestionIndex(quiz.questions.length - 1);
  }

  function DeleteQuestion() {
    quiz.questions.splice(myIndex, 1);
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    setQuestionIndex(myIndex > questionIndex ? questionIndex : questionIndex - 1);
  }

  return (
      <div className='QuizEditorFooterItem'>
        <div className='QuizEditorFooterItemFirstRow'>
          <button
            className='QuizEditorFooterItemMoveButton'
            disabled={myIndex === 0}
            onClick={() => SwapQuestions(myIndex - 1, myIndex)}
          >
            {'<'}
          </button>
          <div
            className='QuizEditorFooterItemInfo'
            onClick={() => setQuestionIndex(myIndex)}
          >
            {question.image
            ?
              <div className='QuizEditorFooterItemInfoImageDiv'>
                <img className='QuizEditorFooterItemInfoImage' src={question.image} />
              </div>
            :
              <p className='QuizEditorFooterItemInfoTitle'>{question.text}</p>
            }
          </div>
          <button
            className='QuizEditorFooterItemMoveButton'
            disabled={myIndex === quiz.questions.length - 1}
            onClick={() => SwapQuestions(myIndex, myIndex + 1)}
          >
            {'>'}
          </button>
        </div>
        <div className='QuizEditorFooterItemSecondRow'>
          <button className='ActionButton QuizEditorFooterItemActionButton' onClick={CopyQuestion}>
            📋
          </button>
          <button className='ActionButton QuizEditorFooterItemActionButton' onClick={DeleteQuestion}>
            🗑️
          </button>
        </div>
      </div>
  );
}