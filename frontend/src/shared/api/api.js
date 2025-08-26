import axios from 'axios'

export const apiClient = axios.create({
	baseURL: 'http://localhost:8000/api/v1/',
	headers: {
		'Content-Type': 'application/json',
	},
})

export const api = {
	get: (endpoint, config) => apiClient.get(endpoint, config),
	post: (endpoint, data, config) => apiClient.post(endpoint, data, config),
	put: (endpoint, data, config) => apiClient.put(endpoint, data, config),
	patch: (endpoint, data, config) => apiClient.patch(endpoint, data, config),
	delete: (endpoint, config) => apiClient.delete(endpoint, config),
}
