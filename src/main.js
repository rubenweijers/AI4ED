import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Before axios
// createApp(App).use(router).mount('#app')

const app = createApp(App);

// Set up global Axios instance
app.config.globalProperties.$http = axios.create({
  baseURL: 'http://localhost:2000/api', // Your backend URL
});

app.use(router);
app.mount('#app');