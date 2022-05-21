import API from '../../../API';
import PlayerInfo from '../../../models/PlayerInfo';
import QuizInfo from '../../../models/QuizInfo';
import '../../../styles/QuizWaitingRoom.css';

interface Parameters {
  quiz: QuizInfo,
  players: PlayerInfo[] | null,
  start: () => void,
}

export default function QuizWaitingRoom({quiz, players, start}: Parameters) {

  return (
    <div className='QuizWaitingRoomContainer'>
      <h1 className='QuizWaitingRoomTitle'>{quiz.title}</h1>
      <h2>Join code: {quiz.code}</h2>
      <h2>Host: {quiz.hostNickname}</h2>
      <h3>Players:</h3>
      <div className='QuizWaitingRoomPlayersList'>
      {players == null
      ? <p>Please stand by...</p>
      : players.map(p => <p key={p.id}>{p.nickname}</p>)}
      </div>
      { quiz.hostNickname === API.GetNickname() &&
      <button 
        className='TextButton QuizWaitingRoomPlayButton'
        onClick={start}
      >
        Start!
      </button>}
    </div>
  );
}