import { useEffect } from 'react';
import Answer from '../../../models/Answer';
import Question from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import '../../../styles/QuizEditorQuestion.css';
import QuizEditorQuestionAnswer from './QuizEditorQuestionAnswer';

interface Parameters {
  question: Question,
  setQuestion: (question: Question) => void,
}

export default function QuizEditorQuestion({question, setQuestion}: Parameters) {

  const answers = question.answers;

  function setAnswers(newAnswers: Answer[]) {
    question.answers = newAnswers;
    setQuestion(JSON.parse(JSON.stringify(question)));
  }

  function SynchronizeAnswersWithQuestionType() {
    if (question.type === QuestionType.Open) {
      if (answers.length !== 1 || !answers[0].isRight) {
        const oneAnswer = answers.slice(0, 1);

        while (oneAnswer.length < 1)
          oneAnswer.push({id: 0, priority: null, text: 'answer', isRight: true});
        
        oneAnswer[0].isRight = true;
        setAnswers(oneAnswer);
      }
    }
    else {
      if (answers.length !== 4) {
        const fourAnswers = answers.slice(0, 4);

        while (fourAnswers.length < 4)
          fourAnswers.push({id: 0, priority: null, text: '', isRight: false});

        setAnswers(fourAnswers);
      }
    }
  }

  useEffect(() => {
    SynchronizeAnswersWithQuestionType();
  }, [question, question.type]);

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
            <label className='QuizEditorQuestionSettingsItemTitle'>Time limit<br/>(seconds)</label>
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
            placeholder='Enter question text'
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
          { answers.map((answer, index) => 
              <QuizEditorQuestionAnswer
                key={index}
                text={answer.text}
                setText={(text) => { answer.text = text; setAnswers(answers); }}
                selected={() => answer.isRight}
                setSelected={(value) => {
                  if (question.type !== QuestionType.Open) {
                    answer.isRight = value;
                    setAnswers(answers);
                  }}}
              />
          )}
        </div>
      </div>
  );
}