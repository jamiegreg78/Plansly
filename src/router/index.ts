import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'

const AuthSection = () => import('@/views/auth/AuthSection.vue')
const Register = () => import('@/views/auth/RegisterSection.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/auth',
      component: AuthSection,
      children: [
        {
          path: 'register',
          component: Register
        }
      ]
    }
  ]
})

export default router
