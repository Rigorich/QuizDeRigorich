import '../../../../styles/QuizQuestion.css';

interface Parameters {
  text: string,
  setText: (newState: string) => void,
}

export default function OpenAnswer({text, setText}: Parameters) {

  return (
      <div className='QuizQuestionOpenAnswer'>
        <textarea 
          className='TextInput TextArea QuizQuestionOpenAnswerTextArea'
          placeholder='Enter your answer'
          value={text}
          onChange={e => setText(e.target.value.replace(/\n/g, ''))}
        />
      </div>
  );
}