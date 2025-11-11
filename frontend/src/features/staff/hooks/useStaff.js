import { useState } from 'react'
import api from '@/shared/api/client'
import { toastSuccess } from '@/lib/toast'

export const useStaff = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [staff, setStaff] = useState([])
	const [staffData, setStaffData] = useState({})
	// const [clientSelectionList, setClientSelectionList] = useState([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 10,
		totalCount: 0,
		hasMore: false,
	})

	const fetchStaff = (params = {}) => {
		setIsLoading(true)
		const apiParams = {
			offset: ((params.page || 1) - 1) * (params.pageSize || 10),
			limit: params.pageSize || 10,
			...params,
		}
		delete apiParams.page
		delete apiParams.pageSize

		api
			.get('/users', { params: apiParams })
			.then(response => {
				setStaff(response.data.items)
				setPagination(prev => ({
					...prev,
					currentPage: params.page || 1,
					pageSize: params.pageSize || prev.pageSize,
					totalCount: response.data.pagination.count,
					hasMore: response.data.pagination.has_more,
				}))
			})
			.catch(err => {
				console.error('Error fetching clients:', err)
			})
			.finally(() => setIsLoading(false))
	}
	const createInvite = (currentStudioUuid, data) => {
		setIsLoading(true)

		return api
			.post(`/studios/${currentStudioUuid}/invite`, data)
			.then(response => {
				toastSuccess(`url${response.data.url}`)
				return response.data
			})
			.catch(err => {
				console.error('Error creating studio:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const handlePageChange = (page, pageSize = pagination.pageSize) => {
		fetchStaff({ page, pageSize })
	}

	return {
		staff,
		staffData,
		isLoading,
		pagination,

		fetchStaff,
		createInvite,
		handlePageChange,
	}
}
