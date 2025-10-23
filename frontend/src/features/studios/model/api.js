import api from '@/shared/api/client'
import { useState } from 'react'

const useStudios = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [studios, setStudios] = useState([])

	const fetchStudios = (params = {}) => {
		setIsLoading(true)

		api
			.get('/studios', { params })
			.then(response => {
				setStudios(response.data)
			})
			.catch(err => {
				console.error('Error fetching studios:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const createStudio = data => {
		setIsLoading(true)

		return api
			.post('/studios', data)
			.then(response => {
				setStudios(prev => ({
					...prev,
					items: [...prev.items, response.data],
					pagination: {
						...prev.pagination,
						count: prev.pagination.count + 1,
					},
				}))
				return response.data
			})
			.catch(err => {
				console.error('Error creating studio:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const updateStudio = (uuid, data) => {
		setIsLoading(true)

		return api
			.patch(`/studios/${uuid}`, data)
			.then(response => {
				setStudios(prev => ({
					...prev,
					items: prev.items.map(studio =>
						studio.uuid === uuid ? response.data : studio
					),
				}))
				return response.data
			})
			.catch(err => {
				console.error('Error updating studio:', err)
			})
			.finally(() => setIsLoading(false))
	}

	return {
		studios,
		isLoading,

		fetchStudios,
		createStudio,
		updateStudio,
	}
}
export default useStudios
