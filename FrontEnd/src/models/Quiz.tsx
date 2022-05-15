import Question from "./Question";

export default interface Quiz {
  id: number,
  title: string,
  questions: Question[],
}