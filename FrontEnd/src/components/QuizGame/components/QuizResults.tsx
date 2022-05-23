import PlayerInfo from '../../../models/PlayerInfo';
import QuizDeRigorichHeader from '../../QuizDeRigorichHeader';
import '../../../styles/QuizResults.css';

interface Parameters {
  results: PlayerInfo[],
  title: string,
}

export default function QuizResults({results, title}: Parameters) {

  return (
    <>
      <QuizDeRigorichHeader />
      <div className='QuizResultsContainer'>
        <h1 className='QuizResultsTitle'>
          {title}
        </h1>
        {results
          .map(r => { return { id: r.id, nickname: r.nickname, answers: r.answers.filter(a => a.isRight).length }})
          .sort((a, b) => b.answers - a.answers)
          .map(r =>
            <div key={r.id} className='QuizResultsRow'>
              <p className='QuizResultsRowNickname'>{r.nickname}</p>
              <p className='QuizResultsRowScore'>{r.answers}</p>
            </div>
        )}
      </div>
    </>
  );
}