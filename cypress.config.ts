import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
		baseUrl: 'http://localhost:4173'
	},
	env: {
		'MAILSLURP_API_KEY': 'edd12da8c3f2524278217dbe6b91e019028d18978ddd7ebfa3d78a2746937197'
	}
})
