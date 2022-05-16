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
      timeLimitInSeconds: 10,
      text: 'How many?',
      image: 'https://paperpaper.ru/wp-content/uploads/2020/12/bptkvkkkfgs.jpg',
      answers: [
        {
          id: 0,
          text: 'How many?',
          image: null,
          isRight: false,
        },
        {
          id: 0,
          text: '42',
          image: null,
          isRight: true,
        },
        {
          id: 0,
          text: '1',
          image: null,
          isRight: false,
        },
        {
          id: 0,
          text: 'No',
          image: null,
          isRight: false,
        },
      ],
    },
    {
      id: 0,
      priority: null,
      type: QuestionType.Multiple,
      timeLimitInSeconds: 10,
      text: 'What?',
      image: null,
      answers: [
        {
          id: 0,
          text: 'What?',
          image: 'https://www.meme-arsenal.com/memes/37f83e6e5c7239778620099135f51092.jpg',
          isRight: true,
        },
        {
          id: 0,
          text: 'What?',
          image: null,
          isRight: true,
        },
        {
          id: 0,
          text: 'What?',
          image: 'https://www.meme-arsenal.com/memes/37f83e6e5c7239778620099135f51092.jpg',
          isRight: true,
        },
      ], 
    },
    {
      id: 0,
      priority: null,
      type: QuestionType.Open,
      timeLimitInSeconds: 10,
      text: 'Question?',
      image: null,
      answers: [
        {
          id: 0,
          text: 'Answer',
          image: null,
          isRight: true,
        }
      ], 
    },
  ]
};

export default QuizExample;