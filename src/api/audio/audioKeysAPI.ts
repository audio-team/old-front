import {AxiosAPI} from '../API';
import {AudioMeta} from '../../component/FileList/data';

interface KeysIn {
  datasetID?: number;
  audios: { id: string; customMeta: AudioMeta[] }[];
}

interface KeysOut {
  keys: Record<string, number>;
}

const audioKeysAPI = new AxiosAPI<KeysIn, KeysOut>('/audio/keys', 'POST', 'Register Audio Key', 'data');

export default audioKeysAPI;
