import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Ensure this is the correct path
import store from './store';    // Ensure this is the correct path
import './assets/styles.css';

console.log('Creating Vue app...');
console.log('Store:', store);
console.log('Router:', router);

const app = createApp(App);

// Make sure the router and store are used correctly
app.use(store);
app.use(router);

app.mount('#app');  // Mounting the app

console.log('Vue app mounted successfully');
