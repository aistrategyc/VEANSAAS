import { useCallback, useState } from 'react'
import { api } from '../api/api'

export const useApi = () => {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const executeRequest = useCallback(async (requestFn, ...args) => {
		setLoading(true)
		setError(null)

		try {
			const response = await requestFn(...args)
			setData(response.data)
			return response
		} catch (err) {
			const errorMessage =
				err.response?.data?.detail || err.message || 'Unknown error'
			setError(errorMessage)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const get = useCallback(
		(endpoint, config) => executeRequest(api.get, endpoint, config),
		[executeRequest]
	)

	const post = useCallback(
		(endpoint, data, config) =>
			executeRequest(api.post, endpoint, data, config),
		[executeRequest]
	)

	const put = useCallback(
		(endpoint, data, config) => executeRequest(api.put, endpoint, data, config),
		[executeRequest]
	)

	const patch = useCallback(
		(endpoint, data, config) =>
			executeRequest(api.patch, endpoint, data, config),
		[executeRequest]
	)

	const deleteRequest = useCallback(
		(endpoint, config) => executeRequest(api.delete, endpoint, config),
		[executeRequest]
	)

	// Сброс состояния
	const reset = useCallback(() => {
		setData(null)
		setError(null)
		setLoading(false)
	}, [])

	return {
		
		data,
		error,
		loading,

		get,
		post,
		put,
		patch,
		delete: deleteRequest,

		reset,
		hasError: error !== null,
		isSuccess: data !== null && error === null,
	}
}
