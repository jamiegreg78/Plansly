export const AuthRoutes = {
	register: '/auth/register',
	login: '/auth/login',
	verify: '/auth/verify'
}

export const AppRoutes = {
	dashboard: '/app/dashboard',
	module: '/app/module/:moduleId',
	board: '/app/module/:moduleId/board/:boardId',
	list: '/app/module/:moduleId/list/:boardId',
	overview: '/app/module/:moduleId/overview/:boardId'
}