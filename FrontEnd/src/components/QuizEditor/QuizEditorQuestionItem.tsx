import Quiz from '../../models/Quiz';
import '../../styles/QuizEditorQuestionItem.css';

interface Parameters {
  quiz: Quiz,
  setQuiz: (quiz: Quiz) => void,
  index: number,
  setQuestionIndex: (index: number) => void,
}

export default function QuizEditorQuestionItem({quiz, setQuiz, index, setQuestionIndex}: Parameters) {

  const question = quiz.questions[index];

  function SwapQuestions(first: number, second: number) {
    const tmp = quiz.questions[first];
    quiz.questions[first] = quiz.questions[second];
    quiz.questions[second] = tmp;
    setQuiz({...quiz});
  }

  function CopyQuestion() {
    quiz.questions.push(quiz.questions[index]);
    const clone = JSON.parse(JSON.stringify(quiz));
    setQuiz(clone);
  }

  function DeleteQuestion() {
    quiz.questions.splice(index, 1);
    setQuiz({...quiz});
  }

  return (
      <div className='QuizEditorQuestionItem'>
        <div className='QuizEditorQuestionItemFirstRow'>
          <button
            className='QuizEditorQuestionItemMoveButton'
            disabled={index === 0}
            onClick={() => SwapQuestions(index - 1, index)}
          >
            {'<'}
          </button>
          <div
            className='QuizEditorQuestionItemInfo'
            onClick={() => setQuestionIndex(index)}
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
            disabled={index === quiz.questions.length - 1}
            onClick={() => SwapQuestions(index, index + 1)}
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