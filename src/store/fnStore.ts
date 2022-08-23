import {defineStore} from 'pinia';
import {MessageOption} from '../widget/CornerMessage';

const useFnStore = defineStore('fn', () => {
  let message: (option: MessageOption) => void;
  return {
    message: message!
  };
});

export default useFnStore;
