import { useState } from 'react'
import api from '@/shared/api/client'
import { toastSuccess } from '@/lib/toast'

export const useClient = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [clients, setClients] = useState([])
	const [clientData, setClientData] = useState({})
	const [clientSelectionList, setClientSelectionList] = useState([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 10,
		totalCount: 0,
		hasMore: false,
	})

	const fetchClients = (params = {}) => {
		setIsLoading(true)
		const apiParams = {
			offset: ((params.page || 1) - 1) * (params.pageSize || 10),
			limit: params.pageSize || 10,
			...params,
		}
		delete apiParams.page
		delete apiParams.pageSize

		api
			.get('/customers', { params: apiParams })
			.then(response => {
				setClients(response.data.items)
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
	const getClientInfo = uuid => {
		setIsLoading(true)

		api
			.get(`/customers/${uuid}`)
			.then(response => {
				setClientData(response.data)
			})
			.catch(err => {
				console.error('Error fetching studios:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const createClient = data => {
		setIsLoading(true)

		return api
			.post('/customers', data)
			.then(response => {
				setClients(prev => [...prev, response.data])
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

	const updateClient = (uuid, data) => {
		setIsLoading(true)

		return api
			.patch(`/customers/${uuid}`, data)
			.then(response => {
				setClients(prev => [
					...prev.map(client =>
						client.uuid === uuid ? response.data : client
					),
				])
				return response.data
			})
			.catch(err => {
				console.error('Error updating studio:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const getClientSelectionList = () => {
		setIsLoading(true)

		api
			.get(`/customers/selection`)
			.then(response => {
				setClientSelectionList(response.data.items)
			})
			.catch(err => {
				console.error('Error fetching studios:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const handlePageChange = (page, pageSize = pagination.pageSize) => {
		fetchClients({ page, pageSize })
	}

	return {
		clients,
		clientData,
		isLoading,
		clientSelectionList,
		pagination,

		fetchClients,
		createClient,
		updateClient,
		getClientInfo,
		getClientSelectionList,
		handlePageChange,
	}
}
