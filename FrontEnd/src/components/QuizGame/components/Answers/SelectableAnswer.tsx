import Answer from '../../../../models/Answer';

interface Parameters {
  answer: Answer,
  isSelected: () => boolean,
  setIsSelected: (newState: boolean) => void,
}

export default function SelectableAnswer({answer, isSelected, setIsSelected}: Parameters) {

  return (
      <div>
        { answer.text &&
          <p>{answer.text}</p>
        }
        { answer.image &&
          <img src={answer.image} />
        }
        <input
          type="checkbox"
          checked={isSelected()}
          onChange={event => setIsSelected(event.target.checked)}
        />
      </div>
  );
}