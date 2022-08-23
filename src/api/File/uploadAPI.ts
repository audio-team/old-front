import {AxiosAPI} from '../API';

interface LoginForm {
    'remember-me': boolean
}

const loginAPI = new AxiosAPI<LoginForm>('/tokens/access', 'POST', 'Login', 'params');
const uploadAPI=new AxiosAPI('url','POST','upload','params')

export default loginAPI;
