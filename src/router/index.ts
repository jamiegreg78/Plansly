import { createRouter, createWebHistory } from 'vue-router'
import { GetUserSession } from '@/backend/Authentication'
import { AuthRoutes, AppRoutes } from './RouteNames'

import Home from '@/views/HomeView.vue'
const AuthView = () => import('@/views/auth/AuthView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const OtpView = () => import('@/views/auth/OtpView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')

const AppView = () => import('@/views/app/AppView.vue')
const DashboardView = () => import('@/views/app/DashboardView.vue')
const ModuleView = () => import('@/views/app/ModuleView.vue')
const BoardView = () => import('@/views/app/BoardView.vue')

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/auth',
			component: AuthView,
			meta: { requiresNotAuthenticated: true},
			children: [
				{
					path: AuthRoutes.register,
					name: 'Register',
					component: RegisterView
				},
				{
					path: AuthRoutes.verify,
					name: 'Verify Your Account',
					component: OtpView
				},
				{
					path: AuthRoutes.login,
					name: 'Login',
					component: LoginView
				}
			]
		},
		{
			path: '/app', 
			component: AppView,
			meta: { requiresAuth: true},
			children: [
				{
					path: AppRoutes.dashboard,
					name: 'Dashboard',
					component: DashboardView,
				},
				{
					path: AppRoutes.module,
					name: 'Module',
					component: ModuleView,
				},
				{
					path: AppRoutes.board,
					name: 'Board',
					component: BoardView,
					meta: { noHeader: true, },
				}
			]
		}
	]
})

// Add guards for authenticated routes - redirect to authentication page 
router.beforeEach(async (to) => {
	// if auth is required - check if the user is logged in, otherwise redirect to login
	if (to.meta.requiresAuth) {
		const { data, error } = await GetUserSession()
		
		if (data.session?.user) {
			return true
		} else {
			return { name: 'Login'}
		}
	}
	
	if (to.meta.requiresNotAuthenticated) {
		const { data, error } = await GetUserSession()
		
		if (!data.session?.user) {
			return true
		} else {
			return { name: 'Dashboard'}
		}
	}
})

export default router
