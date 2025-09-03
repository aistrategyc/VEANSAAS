import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from '../helper/authHelper'

// Конфигурация базового URL
const BASE_URL =
	process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1/'

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
	getRefreshToken: () => getCookie('authToken'),
	setTokens: (accessToken, refreshToken) => {
		setCookie('authToken', accessToken)
		setCookie('refreshToken', refreshToken)
	},
	clearTokens: () => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
	},
	hasTokens: () => {
		return !!getCookie('authToken') && !!getCookie('refreshToken')
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

// Функция обновления токена
const refreshAuthToken = async () => {
	try {
		const refreshToken = tokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await axios.post(
			`${BASE_URL}auth/refresh/`,
			{
				refresh: refreshToken,
			},
			{
				skipAuthRefresh: true, // Пропускаем interceptor для этого запроса
			}
		)

		const { access, refresh } = response.data
		tokenManager.setTokens(access, refresh)
		return access
	} catch (error) {
		tokenManager.clearTokens()
		// Здесь можно добавить редирект на логин
		if (window.location.pathname !== '/login') {
			window.location.href = '/login'
		}
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

		// Пропускаем обработку для определенных эндпоинтов или статусов
		if (
			originalRequest.skipAuthRefresh ||
			error.response?.status !== 401 ||
			originalRequest._retry
		) {
			return Promise.reject(error)
		}

		// Если нет refresh token, сразу отклоняем
		if (!tokenManager.getRefreshToken()) {
			return Promise.reject(error)
		}

		if (isRefreshing) {
			// Добавляем запрос в очередь
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject })
			})
				.then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`
					return apiClient(originalRequest)
				})
				.catch(err => Promise.reject(err))
		}

		originalRequest._retry = true
		isRefreshing = true

		try {
			const newAccessToken = await refreshAuthToken()

			// Обновляем заголовок и повторяем запрос
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

			// Обрабатываем очередь успешных запросов
			processQueue(null, newAccessToken)

			return apiClient(originalRequest)
		} catch (refreshError) {
			// Обрабатываем очередь с ошибкой
			processQueue(refreshError, null)
			return Promise.reject(refreshError)
		} finally {
			isRefreshing = false
		}
	}
)

// API методы
export const api = {
	// GET запрос
	get: (endpoint, config = {}) => apiClient.get(endpoint, config),

	// POST запрос
	post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),

	// PUT запрос
	put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),

	// PATCH запрос
	patch: (endpoint, data, config = {}) =>
		apiClient.patch(endpoint, data, config),

	// DELETE запрос
	delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),

	// Загрузка файлов
	upload: (endpoint, formData, config = {}) =>
		apiClient.post(endpoint, formData, {
			...config,
			headers: {
				...config.headers,
				'Content-Type': 'multipart/form-data',
			},
		}),
}

// Вспомогательные функции для аутентификации
export const authAPI = {
	// Логин
	login: credentials =>
		apiClient.post('auth/login/', credentials, { skipAuth: true }),

	// Регистрация
	register: userData =>
		apiClient.post('auth/register/', userData, { skipAuth: true }),

	// Выход
	logout: () =>
		apiClient.post('auth/logout/', {
			refresh: tokenManager.getRefreshToken(),
		}),

	// Проверка токена
	verifyToken: () =>
		apiClient.post('auth/verify/', {
			token: tokenManager.getAccessToken(),
		}),

	// Обновление токена (явное)
	refreshToken: () => refreshAuthToken(),
}

// Утилита для проверки сетевых ошибок
export const isNetworkError = error => {
	return !error.response && error.message === 'Network Error'
}

// Утилита для проверки timeout
export const isTimeoutError = error => {
	return error.code === 'ECONNABORTED'
}

export default apiClient
