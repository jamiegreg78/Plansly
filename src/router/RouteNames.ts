// These routes are defined as objects
// This is done to avoid typos and to make it easier to refactor
// Changes to the route names will be reflected in the entire project

export const AuthRoutes = {
	register: '/auth/register',
	login: '/auth/login',
	verify: '/auth/verify'
}

export const AppRoutes = {
	dashboard: '/app/dashboard',
	upcoming: '/app/upcoming',
	module: '/app/module/:moduleId',
	board: '/app/module/:moduleId/board/:boardId',
	list: '/app/module/:moduleId/list/:boardId',
	overview: '/app/module/:moduleId/overview/:boardId',
	notFound: '/app/404'
}