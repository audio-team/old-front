import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/rest',
  timeout: 20000,
})

export default instance;
