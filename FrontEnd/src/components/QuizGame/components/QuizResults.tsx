import PlayerInfo from '../../../models/PlayerInfo';

interface Parameters {
  results: PlayerInfo[],
}

export default function QuizResults({results}: Parameters) {

  return (
    <div>
      <h1>
        Results
      </h1>
      {results.map(p =>
      <div key={p.id}>
        {p.nickname} --- {p.answers.filter(a => a.isRight).length}
      </div>)}
    </div>
  );
}