import axios from "axios";
import PlayerInfo from "./models/PlayerInfo";
import Question from "./models/Question";
import Quiz from "./models/Quiz";
import UserAnswer from "./models/UserAnswer";

const API = {

  //@ts-ignore
  BaseUrl: window.config.baseUrl,

  GetHeadersToken() { return { headers: { token: localStorage.getItem('token') || '' }}; },
  GetNickname() { return localStorage.getItem('nickname') || '' },

  async Test(): Promise<string> {
    return axios.get(API.BaseUrl + `api/Test`).then(r => r.data)
  },

  async Register(nickname: string, password: string): Promise<void> {
    return axios
      .post(API.BaseUrl + `api/Register`, { Nickname: nickname, Password: password })
  },

  async Login(nickname: string, password: string): Promise<void> {
    return axios
      .post(API.BaseUrl + `api/Login`, { Nickname: nickname, Password: password })
      .then(r => r.data)
      .then(user => {
        localStorage.setItem('nickname', user.nickname);
        localStorage.setItem('token', user.token);
      })
  },

  async GetAllQuizzes(): Promise<Quiz[]> {
    return axios
      .post<Quiz[]>(API.BaseUrl + `api/GetAllQuizzes`, {}, API.GetHeadersToken())
      .then(r => r.data)
  },

  async CreateQuiz(quiz: Quiz): Promise<void> {
    return axios
      .post(API.BaseUrl + `api/CreateQuiz`, quiz, API.GetHeadersToken())
  },

  async GetQuiz(id: number): Promise<Quiz> {
    return axios
      .post<Quiz>(API.BaseUrl + `api/GetQuiz/${id}`, {}, API.GetHeadersToken())
      .then(r => r.data)
  },

  async UpdateQuiz(quiz: Quiz): Promise<void> {
    return axios
      .post(API.BaseUrl + `api/UpdateQuiz`, quiz, API.GetHeadersToken())
  },

  async DeleteQuiz(id: number): Promise<void> {
    return axios
      .post(API.BaseUrl + `api/DeleteQuiz/${id}`, {}, API.GetHeadersToken())
  },

  async CreateQuizGame(quizId: number): Promise<string> {
    return axios
      .post(API.BaseUrl + `quiz/CreateQuizGame/${quizId}`, {}, API.GetHeadersToken())
      .then(r => r.data)
  },

  async GetCurrentQuestion(quizCode: string): Promise<Question | null> {
    return axios
      .post(API.BaseUrl + `quiz/GetCurrentQuestion/${quizCode}`, {}, API.GetHeadersToken())
      .then(r => r.data)
  },

  async GetPlayersInfo(quizCode: string): Promise<PlayerInfo[]> {
    return axios
      .post(API.BaseUrl + `quiz/GetPlayersInfo/${quizCode}`, {}, API.GetHeadersToken())
      .then(r => r.data)
  },

  async SendAnswer(quizCode: string, answer: UserAnswer): Promise<void> {
    return axios
      .post(API.BaseUrl + `quiz/SendAnswer`, { quizCode, answer }, API.GetHeadersToken())
  },
}

export default API;