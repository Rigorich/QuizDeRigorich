import Question from '../../../models/Question';
import UserAnswer from '../../../models/UserAnswer';
import { QuestionType } from '../../../models/QuestionType';
import SelectableAnswer from './Answers/SelectableAnswer';

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


  return (
    <div>
      <div>
        { question.text
          ? <p>{question.text}</p>
          : <p>Quiz de Rigorich</p>
        }
      </div>
      <div style={{
        width: '100%',
        height: 10,
        backgroundColor: 'red',
        animation: `width ${question.timeLimitInSeconds}s linear`,
      }}>
      </div>
      <div>
        { question.image
          ? <img src={question.image} />
          : <img src={'https://media.moddb.com/images/mods/1/17/16158/14.jpg'} />
        }
      </div>
      <div>
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
      </div>
    </div>
  );
}