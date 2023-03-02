import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/// <reference types="vitest" />
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	test: {
		globals: true
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
          @import "./src/scss/mixins.scss";
          @import "./src/scss/typography.scss";
        `
			}
		}
	}
})
