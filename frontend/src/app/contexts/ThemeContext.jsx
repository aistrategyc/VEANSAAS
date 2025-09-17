import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(undefined)

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

export const ThemeProvider = ({
	children,
	defaultTheme = 'dark',
	storageKey = 'ui-theme',
}) => {
	const [theme, setTheme] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(storageKey) || defaultTheme
		}
		return defaultTheme
	})

	useEffect(() => {
		const root = window.document.documentElement

		root.classList.remove('light', 'dark')
		root.classList.add(theme)

		localStorage.setItem(storageKey, theme)
	}, [theme, storageKey])

	const toggleTheme = () => {
		setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
	}

	const value = {
		theme,
		toggleTheme,
		setTheme,
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
