import Question from '../../../models/Question';
import UserAnswer from '../../../models/UserAnswer';
import { QuestionType } from '../../../models/QuestionType';
import SelectableAnswer from './Answers/SelectableAnswer';
import '../../../styles/QuizQuestion.css';
import OpenAnswer from './Answers/OpenAnswer';

interface Parameters {
  question: Question,
  userAnswer: UserAnswer,
  setUserAnswer: (userAnswer: UserAnswer) => void,
}

export default function QuizQuestion({question, userAnswer, setUserAnswer}: Parameters) {

  function onSingleAnswerSelect(answerId: number, newValue: boolean): void {
    const selectedIds = newValue ? [answerId] : [];
    setUserAnswer({...userAnswer, selectedIds: selectedIds});
    //console.log(`Current answer changed: ${JSON.stringify(userAnswer, null, 4)}`);
  }

  function onMultipleAnswerSelect(answerId: number, newValue: boolean): void {
    const selectedIds = newValue ? userAnswer.selectedIds.concat(answerId) : userAnswer.selectedIds.filter(id => id !== answerId);
    setUserAnswer({...userAnswer, selectedIds: selectedIds});
  }

  function onOpenAnswerChange(newValue: string): void {
    setUserAnswer({...userAnswer, answerText: newValue});
  }

  return (
    <div className='QuizQuestionContainer'>
      <div className='QuizQuestionTitleDiv'>
        <h1 className='QuizQuestionTitle'>{question.text || 'Quiz de Rigorich'}</h1>
      </div>
      <div
        className='QuizQuestionTimer'
        style={{ animationDuration: `${question.timeLimitInSeconds - 0.5}s` }}
      >
      </div>
      <div className='QuizQuestionImageDiv'>
        <img
          className='QuizQuestionImage'
          src={question.image || 'https://i.ibb.co/9nh8nKQ/image.jpg'}
          alt='Question'
        />
      </div>
      <div className='QuizQuestionAnswers'>
        { question.type === QuestionType.Single &&
          question.answers.map(a => 
            <SelectableAnswer
              key={a.id}
              answer={a}
              isSelected={() => userAnswer.selectedIds.includes(a.id)}
              setIsSelected={(newState) => onSingleAnswerSelect(a.id, newState)}
            />)
        }
        { question.type === QuestionType.Multiple &&
          question.answers.map(a => 
            <SelectableAnswer 
              key={a.id}
              answer={a}
              isSelected={() => userAnswer.selectedIds.includes(a.id)}
              setIsSelected={(newState) => onMultipleAnswerSelect(a.id, newState)}
            />)
        }
        { question.type === QuestionType.Open &&
            <OpenAnswer
              text={userAnswer.answerText}
              setText={onOpenAnswerChange}
            />
        }
      </div>
    </div>
  );
}