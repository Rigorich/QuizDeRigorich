import { useState } from 'react';
import API from '../API';
import '../styles/LoginPage.css';

interface Parameters {
  onSuccessLogin: () => void,
}

export default function LoginPage({onSuccessLogin}: Parameters) {

  const [login, setLogin] = useState<string>(API.GetNickname());
  const [password, setPassword] = useState<string>('');

  async function TryLogin() {
    await API.Login(login, password)
      .then(() => onSuccessLogin())
      .catch((e) => alert(e?.response?.data || e?.response || e))
  }

  async function TryRegister() {
    await API.Register(login, password)
      .then(() => TryLogin())
      .catch((e) => alert(e?.response?.data || e?.response || e))
  }

  return (
    <div className='LoginPageContainer'>
      <div className='LoginPageHeader'>
        <h1>Please, log in to proceed</h1>
      </div>
      <div className='LoginPageContainer'>
        <div className='LoginPageLoginInputBox'>
          <input className='TextInput' placeholder='Nickname' value={login} onChange={e => setLogin(e.target.value)} />
          <input className='TextInput' placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
          <div className='LoginPageButtonsRow'>
            <button className='TextButton LoginPageTextButton'
              onClick={TryRegister}
            >
              Sign up
            </button>
            <button className='TextButton LoginPageTextButton'
              onClick={TryLogin}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}