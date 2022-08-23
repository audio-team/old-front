import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import BlankLayout from '../layout/BlankLayout';
import MainLayout from '../layout/MainLayout';
import HomePage from '../component/Home';
import LoginBox from '../component/LoginBox';
import Datasets from '../component/Datasets';
import UploadPage from '../component/UploadPage';
import GenerationPage from '../component/GenerationPage';
import LongLayout from '../layout/LongLayout';
import Classification from '../component/Classification'

const routes: RouteRecordRaw[] = [
  {
    path: '/login', component: BlankLayout, children: [
      {path: '', component: LoginBox}
    ]
  },
  {
    path: '/contribute', component: MainLayout, props: {onePage: true}, children: [
      {path: '', component: UploadPage},
    ]
  },
  {
    path: '/', component: MainLayout, children: [
      {path: 'datasets', component: Datasets},
      {path: 'contribute', component: UploadPage},
      {path: '', component: HomePage}
    ]
  },
  {
    path: '/', component: LongLayout, children: [
      {path: 'generation', component: GenerationPage},
    ]
  },
  {
    path:'/classification',component:MainLayout,children:[
      {path: '',component: Classification}
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
