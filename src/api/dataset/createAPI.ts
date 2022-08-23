import {AxiosAPI} from '../API';
import {TaskType} from '../../util/domain';

interface In {
  name:string;
  publicAvailable:boolean;
  taskType: TaskType;
}

interface Out {
  id: number
}

const createAPI = new AxiosAPI<In, Out>('/dataset/', 'POST', 'Create Dataset', 'data');

export default createAPI;
