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
      {results
        .map(r => { return { id: r.id, nickname: r.nickname, answers: r.answers.filter(a => a.isRight).length }})
        .sort((a, b) => a.answers - b.answers)
        .map(r =>
          <div key={r.id}>
            {r.nickname} --- {r.answers}
          </div>
      )}
    </div>
  );
}