import Quiz from '../../models/Quiz';
import '../../styles/QuizEditorQuestionItem.css';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
  questionIndex: number,
  setQuestionIndex: (index: number) => void,
  myIndex: number,
}

export default function QuizEditorFooterQuestionItem({quiz, setQuiz, questionIndex, setQuestionIndex, myIndex}: Parameters) {

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
    quiz.questions.push(quiz.questions[myIndex]);
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    setQuestionIndex(quiz.questions.length - 1);
  }

  function DeleteQuestion() {
    quiz.questions.splice(myIndex, 1);
    setQuiz(JSON.parse(JSON.stringify(quiz)));
    setQuestionIndex(myIndex > questionIndex ? questionIndex : questionIndex - 1);
  }

  return (
      <div className={'QuizEditorQuestionItem' + (myIndex === questionIndex ? ' QuizEditorFooterItemSelected' : '')}>
        <div className='QuizEditorQuestionItemFirstRow'>
          <button
            className='QuizEditorQuestionItemMoveButton'
            disabled={myIndex === 0}
            onClick={() => SwapQuestions(myIndex - 1, myIndex)}
          >
            {'<'}
          </button>
          <div
            className='QuizEditorQuestionItemInfo'
            onClick={() => setQuestionIndex(myIndex)}
          >
            {question.image
            ?
              <div className='QuizEditorQuestionItemInfoImageDiv'>
                <img className='QuizEditorQuestionItemInfoImage' src={question.image} />
              </div>
            :
              <p className='QuizEditorQuestionItemInfoTitle'>{question.text}</p>
            }
          </div>
          <button
            className='QuizEditorQuestionItemMoveButton'
            disabled={myIndex === quiz.questions.length - 1}
            onClick={() => SwapQuestions(myIndex, myIndex + 1)}
          >
            {'>'}
          </button>
        </div>
        <div className='QuizEditorQuestionItemSecondRow'>
          <button className='ActionButton QuizEditorQuestionItemActionButton' onClick={CopyQuestion}>
            📋
          </button>
          <button className='ActionButton QuizEditorQuestionItemActionButton' onClick={DeleteQuestion}>
            🗑️
          </button>
        </div>
      </div>
  );
}