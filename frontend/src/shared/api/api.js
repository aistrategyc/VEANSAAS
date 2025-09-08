import axios from 'axios'
import { getCookie, setCookie } from '../helper/authHelper'

// Конфигурация базового URL
const BASE_URL = 'http://localhost:8000/api/v1/'

// Создание экземпляра axios
export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
})

// Утилиты для работы с токенами
export const tokenManager = {
	getAccessToken: () => getCookie('authToken'),
	getRefreshToken: () => getCookie('refreshToken'),
	setTokens: accessToken => {
		setCookie('authToken', accessToken)
	},
	clearTokens: () => {
		localStorage.removeItem('authToken')
		localStorage.removeItem('refreshToken')
	},
	hasTokens: () => {
		return (
			!!localStorage.getItem('authToken') &&
			!!localStorage.getItem('refreshToken')
		)
	},
}

// Флаг и очередь для обработки refresh token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

// Создаем отдельный экземпляр axios для запросов без interceptor'ов
const authClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Функция обновления токена
const refreshAuthToken = async () => {
	try {
		const refreshToken = tokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await authClient.post(
			'auth/refresh-access-token',
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		)

		const { access_token } = response.data
		tokenManager.setTokens(access_token)
		return access_token
	} catch (error) {
		console.log('err')
		// tokenManager.clearTokens()
		// if (window.location.pathname !== '/login') {
		// 	window.location.href = '/login'
		// }
		throw error
	}
}

// Request interceptor
apiClient.interceptors.request.use(
	config => {
		// Пропускаем добавление токена для запросов, которые не требуют аутентификации
		if (config.skipAuth) {
			return config
		}

		const token = tokenManager.getAccessToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Response interceptor
apiClient.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes('/auth/')
		) {
			return Promise.reject(error)
		}

		if (!tokenManager.getRefreshToken()) {
			return Promise.reject(error)
		}

		originalRequest._retry = true

		try {
			const newAccessToken = await refreshAuthToken()
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

			// Повторяем оригинальный запрос
			return apiClient(originalRequest)
		} catch (refreshError) {
			console.log('21')
			// tokenManager.clearTokens()
			// if (window.location.pathname !== '/login') {
			// 	window.location.href = '/login'
			// }
			return Promise.reject(refreshError)
		}
	}
)

// API методы
export const api = {
	get: (endpoint, config = {}) => apiClient.get(endpoint, config),
	post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),
	put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),
	patch: (endpoint, data, config = {}) =>
		apiClient.patch(endpoint, data, config),
	delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),
}

// Вспомогательные функции для аутентификации
export const authAPI = {
	login: credentials =>
		apiClient.post('auth/login/', credentials, { skipAuth: true }),

	register: userData =>
		apiClient.post('auth/register/', userData, { skipAuth: true }),

	logout: () => {
		const refreshToken = tokenManager.getRefreshToken()
		return authClient.post(
			'auth/logout/',
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		)
	},

	verifyToken: token => {
		const params = new URLSearchParams()
		if (token) {
			params.append('token', token)
		}

		return apiClient.get(`auth/verify-email/?${params.toString()}`, {
			skipAuth: true,
		})
	},

	refreshToken: () => {
		const refreshToken = tokenManager.getRefreshToken()
		return authClient.post(
			'auth/refresh/',
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		)
	},
}

export default apiClient
