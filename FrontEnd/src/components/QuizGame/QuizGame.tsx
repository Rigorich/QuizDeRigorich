import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import API from '../../API';
import Question from '../../models/Question';
import QuizQuestion from './components/QuizQuestion';
import UserAnswer from '../../models/UserAnswer';
import PlayerInfo from '../../models/PlayerInfo';
import { QuizStatus } from './QuizStatus';
import QuizIntro from './components/QuizIntro';
import QuizInfo from '../../models/QuizInfo';
import QuizResults from './components/QuizResults';
import { Navigate, useParams } from 'react-router-dom';
import QuestionResults from './components/QuestionResults';

export default function QuizGame() {

  const { quizCode } = useParams<{quizCode: string}>();
  if (quizCode == undefined)
    throw 'THE HELL?'

  const [connection, _setConnection] = useState<signalR.HubConnection>(
    new signalR.HubConnectionBuilder()
      .withUrl(API.BaseUrl + 'quiz', { accessTokenFactory: () => localStorage.getItem('token') || '' })
      .configureLogging(signalR.LogLevel.Information)
      .build());

  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [results, setResults] = useState<PlayerInfo[] | null>(null);
  const [status, setStatus] = useState<QuizStatus>(QuizStatus.Undefined);

  async function startConnection() {
    if (connection.state === signalR.HubConnectionState.Connected) return;

    try {
      await connection.start();
      console.log("SignalR Connected.");
      console.log(`Conection = ${connection.state}`);

      const quizInfo = await connection.invoke<QuizInfo>('JoinQuiz', quizCode)
        .catch(() => setStatus(QuizStatus.RedirectToMenu));
      if (!quizInfo) return;
      
      console.log("Quiz joined.");

      setQuizInfo(quizInfo);
      if (quizInfo.finished) {
        setStatus(QuizStatus.QuizResults);
      }
      else {
        setStatus(QuizStatus.Waiting);

        await AskForPlayersInfo();
        await AskForQuestion();
      }
    }
    catch (err) {
      console.log(err);
      setTimeout(startConnection, 5000);
    }
  };

  //console.log(`Current answer render: ${JSON.stringify(userAnswer, null, 4)}`);
  useEffect(() => {
    //console.log(`Current answer effect: ${JSON.stringify(userAnswer, null, 4)}`);
    if (userAnswer) {
      API.SendAnswer(quizCode!, userAnswer);
    }
  }, [userAnswer]);
  
  async function SendAnswer() {
    //console.log(`Current answer send: ${JSON.stringify(userAnswer, null, 4)}`);

    if (userAnswer) {
      await API.SendAnswer(quizCode!, userAnswer);
    }
    
    setStatus(QuizStatus.QuestionResults);
  }

  useEffect(() => {
    connection.on('ReceiveStartQuiz', () => setStatus(QuizStatus.QuizIntro));
    connection.on('AskForQuestion', async () => await AskForQuestion());
    connection.on('SendAnswer', async () => await SendAnswer());
    connection.on('AskForPlayersInfo', async () => await AskForPlayersInfo());
    connection.on('ReceiveFinishQuiz', () => setStatus(QuizStatus.QuizResults));

    connection.onclose(async () => await startConnection());
    startConnection();
  }, []);

  async function AskForQuestion() {
    const question = await API.GetCurrentQuestion(quizCode!);

    if (question) {
      setCurrentQuestion(question);
      setUserAnswer({ questionId: question.id, selectedIds: [], answerText: '', isRight: null });
      setStatus(QuizStatus.QuestionIntro);

      setTimeout(() => {
        setStatus(QuizStatus.QuestionAnswering);
      }, 1000);
    }
    else {
      setCurrentQuestion(null);
      setStatus(QuizStatus.Waiting);
    }
  }
  
  async function AskForPlayersInfo() {
    const players = await API.GetPlayersInfo(quizCode!);
    setResults(players);
  }

  useEffect(() => {console.log(`Status = ${status}`);}, [status]);

  return (
      <div>
        { status === QuizStatus.RedirectToMenu &&
        <Navigate replace to='/' />
        }
        { status === QuizStatus.Undefined &&
        <h1>Please stand by</h1> 
        }
        { status === QuizStatus.Waiting &&
          quizInfo &&
        <>
          <h1>Quiz de Rigorich</h1>
          <h2>{quizInfo.title}</h2>
          <h2>{quizInfo.code}</h2>
          <h2>{quizInfo.hostNickname}</h2>
          <h3>Players:</h3>
          {results == null
          ? <p>Please stand by...</p>
          : results.map(p => <p key={p.id}>{p.nickname}</p>)}
          { quizInfo.hostNickname === API.GetNickname() &&
          <button onClick={async () => await connection.invoke('StartQuiz', quizCode)}>
            Start!
          </button>}
        </>
        }
        { status === QuizStatus.QuizIntro &&
        <>
          <h1>{quizInfo!.title}</h1> 
          <h2>Quiz begins in 3... 2... 1...</h2> 
        </>
        }
        { status === QuizStatus.QuestionIntro &&
          quizInfo && currentQuestion &&
          <QuizIntro
            quiz={quizInfo}
            question={currentQuestion}
          />}
        { status === QuizStatus.QuestionAnswering &&
          currentQuestion && userAnswer &&
          <QuizQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
          />}
        { status === QuizStatus.QuestionResults &&
          results &&
          <QuestionResults
            results={results}
          />}
        { status === QuizStatus.QuizResults &&
          results &&
          <QuizResults
            results={results}
          />}
      </div>
  );
}