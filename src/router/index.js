import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Study from '../views/Study.vue'
import Research from '../views/Research.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login
  // },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
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
  },
  // Tutorial routes
  {
    path: '/secret',
    name: 'secret',
    component: () => import('../views/SecretView.vue'),
  meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
