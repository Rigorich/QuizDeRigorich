import { QuestionType } from "../models/QuestionType";
import Quiz from "../models/Quiz";

const QuizExample: Quiz = {
  id: 0,
  title: "Example Quiz",
  questions: [
    {
      id: 0,
      priority: null,
      type: QuestionType.Single,
      timeLimitInSeconds: 600,
      text: 'How many?',
      image: 'https://paperpaper.ru/wp-content/uploads/2020/12/bptkvkkkfgs.jpg',
      answers: [
        {
          id: 0,
          priority: null,
          text: 'How many?',
          isRight: false,
        },
        {
          id: 0,
          priority: null,
          text: '42',
          isRight: true,
        },
        {
          id: 0,
          priority: null,
          text: '1',
          isRight: false,
        },
        {
          id: 0,
          priority: null,
          text: 'No',
          isRight: false,
        },
        {
          id: 0,
          priority: null,
          text: 'What the dog doing?',
          isRight: false,
        },
        {
          id: 0,
          priority: null,
          text: 'What?',
          isRight: true,
        },
        {
          id: 0,
          priority: null,
          text: 'Why?',
          isRight: true,
        },
      ],
    },
    {
      id: 0,
      priority: null,
      type: QuestionType.Multiple,
      timeLimitInSeconds: 600,
      text: 'What?',
      image: null,
      answers: [
        {
          id: 0,
          priority: null,
          text: 'What?',
          isRight: true,
        },
        {
          id: 0,
          priority: null,
          text: 'What?',
          isRight: true,
        },
        {
          id: 0,
          priority: null,
          text: 'What?',
          isRight: true,
        },
      ], 
    },
    {
      id: 0,
      priority: null,
      type: QuestionType.Open,
      timeLimitInSeconds: 600,
      text: 'Question?',
      image: null,
      answers: [
        {
          id: 0,
          priority: null,
          text: 'Answer',
          isRight: true,
        }
      ], 
    },
  ]
};

export default QuizExample;