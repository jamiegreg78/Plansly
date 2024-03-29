import { createRouter, createWebHistory } from 'vue-router'
import { GetUserSession } from '@/backend/Authentication'
import { AuthRoutes, AppRoutes } from './RouteNames'

import Home from '@/views/HomeView.vue' // Auto imported by Vite

// Lazy load views to reduce initial load time
const AuthView = () => import('@/views/auth/AuthView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const OtpView = () => import('@/views/auth/OtpView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')

const AppView = () => import('@/views/app/AppView.vue')
const DashboardView = () => import('@/views/app/DashboardView.vue')
const UpcomingView = () => import('@/views/app/UpcomingView.vue')
const ModuleView = () => import('@/views/app/ModuleView.vue')
const BoardView = () => import('@/views/app/BoardView.vue')
const ListView = () => import('@/views/app/ListView.vue')
const BoardOverview = () => import('@/views/app/BoardOverview.vue')
const NotFound = () => import('@/components/general/404.vue')

// Defines the routes for the application
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
					meta: { noHeader: true, },
				},
				{
					path: AppRoutes.board,
					name: 'Board',
					component: BoardView,
					meta: { noHeader: true, },
				},
				{
					path: AppRoutes.list,
					name: 'List',
					component: ListView,
					meta: { noHeader: true, },
				},
				{
					path: AppRoutes.overview,
					name: 'Overview',
					component: BoardOverview,
					meta: { noHeader: true, },
				},
				{
					path: AppRoutes.notFound,
					name: '404',
					component: NotFound,
				},
				{
					path: AppRoutes.upcoming,
					name: 'Upcoming',
					component: UpcomingView,
				}
			]
		},
		{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
	]
})

// Add guards for authenticated routes
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
	
	// if auth is not required, check that the user is not logged in, otherwise redirect to dashboard
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
