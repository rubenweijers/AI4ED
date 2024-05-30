import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Study from '../views/Study.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Chat from '../views/Chat.vue'
import PreTest from '../views/PreTest.vue'
import PostTest from '../views/PostTest.vue'
import Survey from '../views/Survey.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/study',
    name: 'Study',
    component: Study
  },
  {
    path: '/pretest',
    name: 'PreTest',
    component: PreTest
  },
  {
    path: '/posttest',
    name: 'PostTest',
    component: PostTest
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/survey',
    name: 'Survey',
    component: Survey
  },
  { 
    path: '/:catchAll(.*)', // Catch-all route
    redirect: '/'  // Redirect unmatched paths to Home
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
