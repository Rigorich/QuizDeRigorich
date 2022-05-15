import { useState } from 'react';
import API from '../API';

interface Parameters {
  onSuccessLogin: () => void,
}

export default function LoginPage({onSuccessLogin}: Parameters) {

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div>
      <h1>Please, log in to proceed</h1>
      <input value={login} onChange={e => setLogin(e.target.value)} />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

      <button onClick={async () => await API.Register(login, password)
          .then(() => alert('Success!'))
          .catch(() => alert('Register error'))}
      >
        Sign up
      </button>
      <button 
        onClick={async () => await API.Login(login, password)
        .then(() => onSuccessLogin())
        .catch(() => alert('Login error'))}
      >
        Sign in
      </button>
    </div>
  );
}