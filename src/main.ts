import {createApp} from 'vue';
import App from './App.vue';
import router from './config/route';
import {createPinia} from 'pinia';
import persistedState from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(persistedState);

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
