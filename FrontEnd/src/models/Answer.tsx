export default interface Answer {
  id: number,
  priority: number | null,
  text: string,
  isRight: boolean,
}