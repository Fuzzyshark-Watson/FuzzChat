import { createRouter, createWebHistory } from 'vue-router';
import StartScreen from '../views/StartScreen.vue';
import CharacterSelection from '../views/CharacterSelection.vue';
import HomeView from '../views/HomeView.vue';
const routes = [
  {
    path: '/',
    name: 'StartScreen',
    component: StartScreen,
  },
  {
    path: '/CharacterSelection',
    name: 'CharacterSelection',
    component: CharacterSelection,
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView,
  }
];

const router = createRouter({
  history: createWebHistory(),  // Use createWebHistory or createWebHashHistory depending on your setup
  routes,
});

console.log('Router created successfully:', router);

export default router;
