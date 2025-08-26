import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
	return useContext(AuthContext)
}
//переписать !!!
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	// useCallback для стабильных функций
	const setAxiosAuthHeader = useCallback(token => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	}, [])

	const login = useCallback(
		(token, options = {}) => {
			const { expires = 7 } = options
			setCookie('authToken', token, expires)
			setAxiosAuthHeader(token)
			setIsAuthenticated(true)
		},
		[setAxiosAuthHeader]
	)

	const logout = useCallback(() => {
		deleteCookie('authToken')
		delete axios.defaults.headers.common['Authorization']
		setIsAuthenticated(false)
	}, [])

	// Основной useEffect для проверки аутентификации
	useEffect(() => {
		let isMounted = true // Флаг для избежания утечек памяти

		const checkAuth = async () => {
			try {
				const token = getCookie('authToken')

				if (!token) {
					if (isMounted) setLoading(false)
					return
				}

				// Опционально: проверка валидности токена на сервере
				try {
					if (isMounted) {
						setAxiosAuthHeader(token)
						setIsAuthenticated(true)
					}
				} catch (error) {
					console.warn('Token validation failed:', error)
					deleteCookie('authToken')
				}
			} catch (error) {
				console.error('Auth check error:', error)
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		checkAuth()

		return () => {
			isMounted = false // Cleanup функция
		}
	}, [setAxiosAuthHeader])

	const value = {
		isAuthenticated,
		loading,
		login,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Функции работы с куками (оставляем без изменений)
export const deleteCookie = name => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const setCookie = (name, value, days = 7) => {
	const date = new Date()
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
	const expires = `expires=${date.toUTCString()}`
	document.cookie = `${name}=${value};${expires};path=/`
}

export const getCookie = name => {
	const nameEQ = `${name}=`
	const ca = document.cookie.split(';')
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) === ' ') c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
	}
	return null
}
