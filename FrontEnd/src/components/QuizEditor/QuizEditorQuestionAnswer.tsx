import QuizEditorQuestionAnswerCheckbox from "./QuizEditorQuestionAnswerCheckbox";

interface Parameters {
  text: string,
  setText: (text: string) => void;
  selected: () => boolean,
  setSelected: (newState: boolean) => void,
}

export default function SelectableAnswer({text, setText, selected, setSelected}: Parameters) {

  return (
      <div className='QuizQuestionAnswer'>
        <div className='QuizQuestionAnswerInner'>
          <p className='QuizQuestionAnswerText'>{text}</p>
          <QuizEditorQuestionAnswerCheckbox
            checked={selected()}
            onClick={() => setSelected(!selected())}
          />
        </div>
      </div>
  );
}