import Question from '../../models/Question';
import { QuestionType } from '../../models/QuestionType';
import '../../styles/QuizEditorQuestion.css';

interface Parameters {
  question: Question,
  setQuestion: (question: Question) => void,
}

export default function QuizEditorQuestion({question, setQuestion}: Parameters) {

  return (
      <div className='QuizEditorQuestion'>
        <div className='QuizEditorQuestionSettings'>
          <div className='QuizEditorQuestionSettingsItem'>
            <label className='QuizEditorQuestionSettingsItemTitle'>Question type</label>
            <select
              className='Select'
              value={question.type}
              onChange={e => setQuestion({...question, type: e.target.value as QuestionType})}
            >
              {Object.keys(QuestionType).map(key =>
                <option key={key} value={key}>{key}</option>
              )}
            </select>
          </div>
          <div className='QuizEditorQuestionSettingsItem'>
            <label className='QuizEditorQuestionSettingsItemTitle'>Time limit (seconds)</label>
            <input
              type='number'
              className='TextInput'
              value={question.timeLimitInSeconds}
              min={1}
              max={300}
              onChange={e => {
                const newValue = +e.target.value || 1;
                if (newValue && newValue >= 1 && newValue <= 300) 
                  setQuestion({...question, timeLimitInSeconds: newValue});
              }}
            />
          </div>
        </div>
        <div className='QuizEditorQuestionMain'>
          <textarea 
            className='TextInput TextArea QuizEditorQuestionTextArea'
            placeholder='Enter quiestion text'
            value={question.text || ''}
            onChange={e => setQuestion({...question, text: e.target.value.replace(/\n/g, '').substring(0, 200)})}
          />
          <div className='QuizQuestionImageDiv QuizEditorQuestionImageDiv'>
            <img
              className='QuizQuestionImage'
              src={question.image || 'https://i.ibb.co/BKk1N3r/no-image.jpg'}
              alt='Question'
            />
          </div>
          <input
            className='TextInput QuizEditorQuestionImageLink'
            placeholder='Enter image link'
            value={question.image || ''}
            onChange={e => setQuestion({...question, image: e.target.value})}
          />
        </div>
        <div className='QuizEditorQuestionAnswers'>

          <div className='QuizEditorQuestionAnswer'>
          
          </div>
        </div>
      </div>
  );
}