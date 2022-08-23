import SubmitBox from './SubmitBox.vue';
import {TaskType} from '../../../util/domain';

interface UploadOption {
  name: string;
  publicAvailable: boolean,
  taskType: TaskType
}

export default SubmitBox;

export {UploadOption};
