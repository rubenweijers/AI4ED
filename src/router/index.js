import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Study from '../views/Study.vue'
import Research from '../views/Research.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/research',
    name: 'Research',
    component: Research
  },
  {
    path: '/study',
    name: 'Study',
    component: Study
  },
  { 
    path: '/:catchAll(.*)', // Catch-all route
    redirect: '/'  // Redirect unmatched paths to Home
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
