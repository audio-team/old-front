import {AxiosAPI} from '../API';

const classificationAPI = new AxiosAPI<FormData>('/audio/classification', 'POST', 'GET Audio File Tag', 'data');

export default classificationAPI;