import Question from '../../../models/Question';
import QuizInfo from '../../../models/QuizInfo';

interface Parameters {
  quiz: QuizInfo,
  question: Question,
}

export default function QuizQuestion({quiz, question}: Parameters) {

  return (
    <div>
      <h1>
        {quiz.title}
      </h1>
      <h2>
        Question {question.priority}/{quiz.questionsCount}
      </h2>
    </div>
  );
}