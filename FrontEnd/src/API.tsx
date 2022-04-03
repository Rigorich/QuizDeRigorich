import axios from "axios";

const API = {

  //@ts-ignore
  BaseUrl: window.config.baseUrl,

  async Register(nickname: string, password: string): Promise<void> {
    await axios
      .post(API.BaseUrl + 'api/Register', { Nickname: nickname, Password: password });
    
    return await this.Login(nickname, password);
  },

  async Login(nickname: string, password: string): Promise<void> {
    await axios
      .post(API.BaseUrl + 'api/Login', { Nickname: nickname, Password: password })
      .then(r => r.data)
      .then(user => {
        localStorage.setItem('nickname', user.Nickname);
        localStorage.setItem('token', user.Token);
      })
  }
}

export default API;