import QuizEditorQuestionAnswerCheckbox from "./QuizEditorQuestionAnswerCheckbox";

interface Parameters {
  text: string,
  setText: (text: string) => void;
  selected: () => boolean,
  setSelected: (newState: boolean) => void,
}

export default function QuizEditorQuestionAnswer({text, setText, selected, setSelected}: Parameters) {

  return (
      <div className='QuizEditorQuestionAnswer'>
        <div className='QuizEditorQuestionAnswerInner'>
          <textarea 
            className='TextInput TextArea QuizEditorQuestionAnswerTextArea'
            placeholder='Enter answer text'
            value={text}
            onChange={e => setText(e.target.value.replace(/\n/g, '').substring(0, 150))}
          />
          <QuizEditorQuestionAnswerCheckbox
            checked={selected()}
            onClick={() => setSelected(!selected())}
          />
        </div>
      </div>
  );
}