import UserAnswer from "./UserAnswer";

export default interface PlayerInfo {
  id: number,
  nickname: string,
  answers: UserAnswer[],
}