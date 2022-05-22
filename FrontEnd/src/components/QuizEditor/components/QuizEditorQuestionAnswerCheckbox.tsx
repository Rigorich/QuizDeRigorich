interface Parameters {
  checked: boolean,
  onClick: () => void,
}

export default function QuizEditorQuestionAnswerCheckbox({checked, onClick}: Parameters) {

  return (
      <div className='QuizEditorQuestionAnswerSelect' onClick={onClick}>
        {checked && <div className='QuizEditorQuestionAnswerSelectMark'>✔</div>}
      </div>
  );
}