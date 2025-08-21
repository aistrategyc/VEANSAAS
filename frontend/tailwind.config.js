/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#fdf2f8',
					100: '#fce7f3',
					500: '#ec4899',
					600: '#db2777',
					900: '#831843',
				},
				ink: {
					100: '#e5e7eb',
					500: '#6b7280',
					900: '#111827',
				},
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
