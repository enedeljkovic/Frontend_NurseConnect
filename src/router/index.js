import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Materials from '../views/Materials.vue';
import Quizzes from '../views/Quizzes.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import AddQuiz from '../views/AddQuiz.vue';
import TakeQuiz from '../views/TakeQuiz.vue';
import Settings from '../views/Settings.vue';
import SubjectMaterials from '../views/SubjectMaterials.vue';
import MaterialDetails from '../views/MaterialDetails.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/materials', name: 'Materials', component: Materials },
  { path: '/materials/:predmet', name: 'SubjectMaterials', component: SubjectMaterials },
  { path: '/quizzes', name: 'Quizzes', component: Quizzes },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/add-quiz', name: 'AddQuiz', component: AddQuiz },
  { path: '/quizzes/:id', name: 'TakeQuiz', component: TakeQuiz },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/materials/:id', name: 'MaterialDetails', component: MaterialDetails }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !user) {
    return next('/login');
  }

  next();
});

export default router;
