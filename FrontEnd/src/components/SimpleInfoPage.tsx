import '../styles/SimpleInfoPage.css';

interface Parameters {
  text: string,
}

export default function SimpleInfoPage({text}: Parameters) {

  return (
    <div className='SimpleInfoPageContainer'>
      <h2 className='SimpleInfoPageText'>
        {text}
      </h2>
    </div>
  );
}