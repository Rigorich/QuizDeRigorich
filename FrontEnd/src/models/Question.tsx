import Answer from "./Answer";
import { QuestionType } from "./QuestionType";

export default interface Question {
  id: number,
  priority: number | null,
  type: QuestionType,
  timeLimitInSeconds: number,
  text: string | null,
  image: string | null,
  answers: Answer[],
}