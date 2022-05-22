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
      <div className='QuizWaitingRoomTitleDiv'>
        <h1 className='QuizWaitingRoomTitle'>{quiz.title}</h1>
      </div>
      <p className='QuizWaitingRoomSubTitle'>Quiz game code</p>
      <p className='QuizWaitingRoomCode'>{quiz.code}</p>
      { quiz.hostNickname === API.GetNickname() &&
      <button 
        className='TextButton QuizWaitingRoomPlayButton'
        onClick={start}
      >
        Start!
      </button>}
      <p className='QuizWaitingRoomSubTitle'>Players</p>
      <div className='QuizWaitingRoomPlayersList'>
      {players &&
        players.map(p => 
          <p
            className='QuizWaitingRoomPlayersListRow'
            key={p.id}
          >
            {p.nickname === quiz.hostNickname ? '👑 ' : ''}{p.nickname}
          </p>
      )}
      </div>
    </div>
  );
}