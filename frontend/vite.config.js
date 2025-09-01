import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			shared: '/src/shared',
		},
	},
})
