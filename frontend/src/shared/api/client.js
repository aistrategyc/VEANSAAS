import axios from 'axios'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '@/shared/helper/cookie-utils'

const BASE_URL = 'http://localhost:8000/api/v1'

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
})

const tokenManager = {
	getAccessToken: () => getCookie('authToken'),
	getRefreshToken: () => getCookie('refreshToken'),
	setTokens: accessToken => {
		setCookie('authToken', accessToken)
	},
	clearTokens: () => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
	},
	hasTokens: () => {
		return !!getCookie('authToken') && !!getCookie('refreshToken')
	},
}

const refreshAuthToken = async () => {
	try {
		const refreshToken = tokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await axios.post(
			`${BASE_URL}/auth/refresh-access-token`,
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
		console.error('Token refresh failed:', error)
		throw error
	}
}

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

apiClient.interceptors.request.use(
	config => {
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

apiClient.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			originalRequest._skipAuthRefresh ||
			originalRequest.url?.includes('/auth/')
		) {
			return Promise.reject(error)
		}

		if (!tokenManager.getRefreshToken()) {
			tokenManager.clearTokens()
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
			return Promise.reject(error)
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject })
			})
				.then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`
					return apiClient(originalRequest)
				})
				.catch(err => {
					return Promise.reject(err)
				})
		}

		originalRequest._retry = true
		isRefreshing = true

		try {
			const newAccessToken = await refreshAuthToken()

			if (!newAccessToken) {
				throw new Error('No access token received')
			}

			processQueue(null, newAccessToken)

			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
			return apiClient(originalRequest)
		} catch (refreshError) {
			processQueue(refreshError, null)

			tokenManager.clearTokens()
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
			return Promise.reject(refreshError)
		} finally {
			isRefreshing = false
		}
	}
)

const api = {
	get: (endpoint, config = {}) => apiClient.get(endpoint, config),
	post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),
	put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),
	patch: (endpoint, data, config = {}) =>
		apiClient.patch(endpoint, data, config),
	delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),
}

export default api
