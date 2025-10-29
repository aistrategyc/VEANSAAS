import api from '@/shared/api/client'
import { useState } from 'react'

const useStudios = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [studios, setStudios] = useState([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 4,
		totalCount: 0,
		hasMore: false,
	})

	const fetchStudios = (params = {}) => {
		setIsLoading(true)
		const apiParams = {
			offset: ((params.page || 1) - 1) * (params.pageSize || 4),
			limit: params.pageSize || 4,
			...params,
		}
		delete apiParams.page
		delete apiParams.pageSize

		api
			.get('/studios', { params: apiParams })
			.then(response => {
				setStudios(response.data)
				setPagination(prev => ({
					...prev,
					currentPage: params.page || 1,
					pageSize: params.pageSize || prev.pageSize,
					totalCount: response.data.pagination.count,
					hasMore: response.data.pagination.has_more,
				}))
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
				}))
				setPagination(prev => ({
					...prev,
					totalCount: prev.totalCount + 1,
				}))
				toastSuccess('Клиент создан')
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
	const handlePageChange = (page, pageSize = pagination.pageSize) => {
		fetchStudios({ page, pageSize })
	}

	return {
		studios,
		isLoading,
		pagination,

		handlePageChange,
		fetchStudios,
		createStudio,
		updateStudio,
	}
}
export default useStudios
