import '../../../../styles/QuizQuestion.css';

interface Parameters {
  checked: boolean,
  onClick: () => void,
}

export default function SelectableAnswerCheckbox({checked, onClick}: Parameters) {

  return (
      <div className='QuizQuestionAnswerSelect' onClick={onClick}>
        {checked && <div className='QuizQuestionAnswerSelectMark'>✔</div>}
      </div>
  );
}