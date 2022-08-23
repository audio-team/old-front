import {AxiosAPI} from '../API';
import {TaskType} from '../../util/domain';

interface BaseSpec {
  name: string;
}

interface In {
  type: TaskType;
  specs: BaseSpec[];
}

interface Out {
  name: string;
  tmpSecretId: string;
  tmpSecretKey: string;
  sessionToken: string;
}

const genAPI = new AxiosAPI<In, Out>('/dataset/gen', 'POST', 'Dataset Generation', 'data');

export default genAPI;

