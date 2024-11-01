import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Study_original_fci from '../views/Study_original_fci.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import PostTest from '../views/PostTest.vue'
import Survey from '../views/Survey.vue'
import ThankYou from '../views/ThankYou.vue'
import Chat from '../views/Chat.vue'
import BeliefRating from '../views/BeliefRating.vue'
import PreChat from '../views/PreChat.vue'
import BeliefRating_PostChat from '../views/BeliefRating_PostChat.vue'
import Study2 from '../views/Study2.vue'
import StudyInfo from '../views/StudyInfo.vue'
import ResetPassword from '../views/ResetPassword.vue'
import FCI_Answers from '../views/FCI_Answers.vue'
import Study from '../views/Study.vue'
import Feedback from '../views/Feedback.vue'

const routes = [
  {
    path: '/',
    name: 'StudyInfo',
    component: StudyInfo
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
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword
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
    path: '/study',
    name: 'Study',
    component: Study
  },
  {
    path: '/studyoriginalfci',
    name: 'StudyOriginalFCI',
    component: Study_original_fci
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback
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
    path: '/fcianswers',
    name: 'FCIAnswers',
    component: FCI_Answers
    
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


export default router
