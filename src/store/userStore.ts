import {defineStore} from 'pinia';
import {ref} from 'vue';

const useUserStore = defineStore('user', () => {
    const userId = ref();
    const username = ref();

    return {
      userId, username
    };
  }, {
    persist: true
  }
);

export default useUserStore;
