import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Study from '../views/Study.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import PreTest from '../views/PreTest.vue'
import PostTest from '../views/PostTest.vue'
import Survey from '../views/Survey.vue'
import ThankYou from '../views/ThankYou.vue'
import Chat from '../views/Chat.vue'
import ChatLearningStyle from '../views/ChatLearningStyle.vue'
import BeliefRating from '../views/BeliefRating.vue'
import PreChat from '../views/PreChat.vue'
import BeliefRating_PostChat from '../views/BeliefRating_PostChat.vue'
import Study2 from '../views/Study2.vue'
import WritingScreening from '../views/WritingScreening.vue'

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
    path: '/writingscreening',
    name: 'WritingScreening',
    component: WritingScreening
  },
  {
    path: '/study',
    name: 'Study',
    component: Study
  },
  {
    path: '/study2',
    name: 'Study2',
    component: Study2
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
    path: '/beliefrating',
    name: 'BeliefRating',
    component: BeliefRating
  },
  {
    path: '/beliefratingpostchat',
    name: 'BeliefRatingPostChat',
    component: BeliefRating_PostChat
  },
  {
    path: '/prechat',
    name: 'PreChat',
    component: PreChat
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/chatlearningstyle',
    name: 'ChatLearningStyle',
    component: ChatLearningStyle
  },
  {
    path: '/survey',
    name: 'Survey',
    component: Survey
  },
  { 
    path: '/:catchAll(.*)', // Catch-all route
    redirect: '/'  // Redirect unmatched paths to Home
  },
  {
    path: '/thankyou',
    name: 'ThankYou',
    component: ThankYou
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (to.name === 'Study' && !user) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

export default router
