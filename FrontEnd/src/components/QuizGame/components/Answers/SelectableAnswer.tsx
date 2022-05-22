import Answer from '../../../../models/Answer';
import '../../../../styles/QuizQuestion.css';
import SelectableAnswerCheckbox from './SelectableAnswerCheckbox';

interface Parameters {
  answer: Answer,
  isSelected: () => boolean,
  setIsSelected: (newState: boolean) => void,
}

export default function SelectableAnswer({answer, isSelected, setIsSelected}: Parameters) {

  const color = answer.priority === 1 ? '#33CC33' :
                answer.priority === 2 ? '#5555CC' :
                answer.priority === 3 ? '#DD77DD' :
                answer.priority === 4 ? '#DDDD11' :
                '#CCCCCC';

  return (
      <div className='QuizQuestionAnswer'>
        <div className='QuizQuestionAnswerInner' style={{backgroundColor: color}}>
          <p className='QuizQuestionAnswerText'>{answer.text}</p>
          <SelectableAnswerCheckbox
            checked={isSelected()}
            onClick={() => setIsSelected(!isSelected())}
          />
        </div>
      </div>
  );
}