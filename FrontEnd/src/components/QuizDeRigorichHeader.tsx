import { useNavigate } from "react-router-dom";

export default function QuizDeRigorichHeader() {

  const navigate = useNavigate();

  return (
    <div className='QuizDeRigorichHeader'>
      <p className='QuizDeRigorich' onClick={() => navigate('/')}>Quiz de Rigorich</p>
    </div>
  );
}