// services/auth.service.js

// Константы для ключей
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

// Вспомогательные функции для работы с куками
const setCookie = (name, value, days) => {
	const date = new Date()
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
	const expires = `expires=${date.toUTCString()}`
	document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;secure`
}

const getCookie = name => {
	const nameEQ = `${name}=`
	const ca = document.cookie.split(';')

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) === ' ') c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
	}

	return null
}

const deleteCookie = name => {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// Основные функции сервиса аутентификации
export const authService = {
	// Логин пользователя
	async login(credentials) {
		try {
			const response = await fetch('http://localhost:8000/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.message || 'Ошибка входа')
			}

			const data = await response.json()

			if (data.access_token) {
				authService.setToken(data.access_token)
				if (data.token_type) {
					authService.setUser(data.token_type)
					console.log(data)
				}
				return data
			}

			throw new Error('Токен не получен')
		} catch (error) {
			throw new Error(error.message || 'Ошибка входа')
		}
	},

	// Регистрация пользователя
	async register(userData) {
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.message || 'Ошибка регистрации')
			}

			const data = await response.json()

			if (data.token) {
				authService.setToken(data.token)
				if (data.user) {
					authService.setUser(data.user)
				}
				return data
			}

			throw new Error('Токен не получен')
		} catch (error) {
			throw new Error(error.message || 'Ошибка регистрации')
		}
	},

	// Выход из системы
	logout() {
		authService.removeToken()
		authService.removeUser()
	},

	// Проверка авторизации
	isAuthenticated() {
		return !!authService.getToken()
	},

	// Получение токена
	getToken() {
		return getCookie(TOKEN_KEY)
	},

	// Установка токена
	setToken(token) {
		setCookie(TOKEN_KEY, token, 7) // 7 дней
	},

	// Удаление токена
	removeToken() {
		deleteCookie(TOKEN_KEY)
	},

	// Сохранение данных пользователя
	setUser(user) {
		try {
			localStorage.setItem(USER_KEY, JSON.stringify(user))
		} catch (error) {
			console.error('Ошибка сохранения пользователя:', error)
		}
	},

	// Получение данных пользователя
	getUser() {
		try {
			const userData = localStorage.getItem(USER_KEY)
			return userData ? JSON.parse(userData) : null
		} catch (error) {
			console.error('Ошибка получения пользователя:', error)
			return null
		}
	},

	// Удаление данных пользователя
	removeUser() {
		try {
			localStorage.removeItem(USER_KEY)
		} catch (error) {
			console.error('Ошибка удаления пользователя:', error)
		}
	},

	// Обновление токена
	async refreshToken() {
		try {
			const token = authService.getToken()
			if (!token) {
				throw new Error('Токен не найден')
			}

			const response = await fetch('/api/auth/refresh', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Ошибка обновления токена')
			}

			const data = await response.json()

			if (data.token) {
				authService.setToken(data.token)
				return data.token
			}

			throw new Error('Новый токен не получен')
		} catch (error) {
			authService.logout()
			throw error
		}
	},

	// Валидация токена (опционально)
	async validateToken() {
		try {
			const token = authService.getToken()
			if (!token) return false

			const response = await fetch('/api/auth/validate', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			return response.ok
		} catch (error) {
			return false
		}
	},

	// Сброс пароля
	async resetPassword(email) {
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.message || 'Ошибка сброса пароля')
			}

			return await response.json()
		} catch (error) {
			throw new Error(error.message || 'Ошибка сброса пароля')
		}
	},

	// Изменение пароля
	async changePassword(passwordData) {
		try {
			const token = authService.getToken()
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(passwordData),
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.message || 'Ошибка изменения пароля')
			}

			return await response.json()
		} catch (error) {
			throw new Error(error.message || 'Ошибка изменения пароля')
		}
	},
}

// Экспорт отдельных функций для удобства
export const {
	login,
	register,
	logout,
	isAuthenticated,
	getToken,
	setToken,
	removeToken,
	getUser,
	setUser,
	removeUser,
	refreshToken,
	validateToken,
	resetPassword,
	changePassword,
} = authService

export default authService
