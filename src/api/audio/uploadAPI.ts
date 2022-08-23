import {AxiosAPI} from '../API';

const uploadAPI = new AxiosAPI<FormData>('/audio/binary', 'POST', 'Upload Audio File', 'data');

export default uploadAPI;
