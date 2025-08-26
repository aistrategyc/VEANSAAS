import { useState, useCallback } from 'react'
import axios from 'axios'

// Базовый URL вашего API
const API_BASE_URL = 'http://localhost:8000/api/v1/'

export const useApi = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const apiRequest = useCallback(async (endpoint, options = {}) => {
		const {
			method = 'GET',
			data = null,
			headers = {},
			...restOptions
		} = options

		setLoading(true)
		setError(null)

		try {
			const url = `${API_BASE_URL}${endpoint}`

			const response = await axios({
				url,
				method,
				data,
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				...restOptions,
			})

			return response.data
		} catch (err) {
			const errorMessage =
				err.response?.data?.message || err.message || 'Произошла ошибка'
			setError(errorMessage)
			throw new Error(errorMessage)
		} finally {
			setLoading(false)
		}
	}, [])

	// Специализированные методы
	const get = useCallback(
		(endpoint, options = {}) =>
			apiRequest(endpoint, { method: 'GET', ...options }),
		[apiRequest]
	)

	const post = useCallback(
		(endpoint, data, options = {}) =>
			apiRequest(endpoint, { method: 'POST', data, ...options }),
		[apiRequest]
	)

	const put = useCallback(
		(endpoint, data, options = {}) =>
			apiRequest(endpoint, { method: 'PUT', data, ...options }),
		[apiRequest]
	)

	const del = useCallback(
		(endpoint, options = {}) =>
			apiRequest(endpoint, { method: 'DELETE', ...options }),
		[apiRequest]
	)

	return {
		loading,
		error,
		apiRequest,
		get,
		post,
		put,
		delete: del,
		clearError: () => setError(null),
	}
}
