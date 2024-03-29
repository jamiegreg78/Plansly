/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	'extends': [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	overrides: [
		{
			files: [
				'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
			],
			'extends': [
				'plugin:cypress/recommended'
			]
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'semi': ['error', 'never'],
		'quotes': ['error', 'single'],
		'indent': ['error', 'tab'],
		'eqeqeq': ['error', 'always'],
		'sort-imports': ['error', 'always'],
		"vue/max-attributes-per-line": ["error", {
			"singleline": {
				"max": 1
			},
			"multiline": {
				"max": 1
			}
		}]
	}
}
