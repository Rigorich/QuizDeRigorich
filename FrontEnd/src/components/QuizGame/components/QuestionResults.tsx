import PlayerInfo from '../../../models/PlayerInfo';

interface Parameters {
  results: PlayerInfo[],
}

export default function QuestionResults({results}: Parameters) {

  return (
    <div>
      <h1>
        Intermediate Results
      </h1>
      {results.map(p =>
      <div>
        {p.nickname} --- {p.answers.filter(a => a.isRight).length}
      </div>)}
    </div>
  );
}