import {AxiosAPI} from '../API';

interface LoginForm {
  'remember-me': boolean;
}

interface UserInfo {
  id: number;
  username: string;
}

const loginAPI = new AxiosAPI<LoginForm, UserInfo>('/tokens/access', 'POST', 'Login', 'params');


export default loginAPI;
