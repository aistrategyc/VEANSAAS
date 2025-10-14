import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from '../helper/authHelper'

const BASE_URL = 'http://localhost:8000/api/v1'

export const parseJwt = token => {
	try {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
				.join('')
		)
		return JSON.parse(jsonPayload)
	} catch (e) {
		return null
	}
}

export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
})

export const tokenManager = {
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
		return (
			!!localStorage.getItem('authToken') &&
			!!localStorage.getItem('refreshToken')
		)
	},
}

const authClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

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
		// tokenManager.clearTokens()
		// if (window.location.pathname !== '/login') {
		// 	window.location.href = '/login'
		// }
		throw error
	}
}

apiClient.interceptors.request.use(
	config => {
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

			return apiClient(originalRequest)
		} catch (refreshError) {
			tokenManager.clearTokens()
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
			return Promise.reject(refreshError)
		}
	}
)

export const api = {
	get: (endpoint, config = {}) => apiClient.get(endpoint, config),
	post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),
	put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),
	patch: (endpoint, data, config = {}) =>
		apiClient.patch(endpoint, data, config),
	delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),
}

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

		return apiClient.get(`auth/verify-email?${params.toString()}`, {
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
