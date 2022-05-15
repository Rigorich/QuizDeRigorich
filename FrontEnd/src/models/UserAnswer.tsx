export default interface UserAnswer {
  questionId: number,
  selectedIds: number[],
  answerText: string,
  isRight: boolean | null,
}