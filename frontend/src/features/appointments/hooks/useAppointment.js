import { useState } from 'react'
import api from '@/shared/api/client'

export const useAppointment = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [appointments, setAppointments] = useState([])
	const [clientData, setClientData] = useState({})
	const [servicesSelectionList, setServicesSelectionList] = useState([])
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 10,
		totalCount: 0,
		hasMore: false,
	})

	const fetchAppointments = (params = {}) => {
		setIsLoading(true)
		const apiParams = {
			offset: ((params.page || 1) - 1) * (params.pageSize || 10),
			limit: params.pageSize || 10,
			...params,
		}
		delete apiParams.page
		delete apiParams.pageSize

		api
			.get('/appointments', { params: apiParams })
			.then(response => {
				setAppointments(response.data.items)
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
	const getAppointmentInfo = uuid => {
		setIsLoading(true)

		api
			.get(`/appointments/${uuid}`)
			.then(response => {
				setClientData(response.data)
			})
			.catch(err => {
				console.error('Error fetching studios:', err)
			})
			.finally(() => setIsLoading(false))
	}

	const createAppointment = data => {
		setIsLoading(true)

		return api
			.post('/appointments', data)
			.then(response => {
				setAppointments(prev => [...prev, response.data])
				setPagination(prev => ({
					...prev,
					totalCount: prev.totalCount + 1,
				}))
				toastSuccess('Запись создана')
				return response.data
			})
			.catch(err => {})
			.finally(() => setIsLoading(false))
	}

	const getServicesSelectionList = () => {
		setIsLoading(true)

		return api
			.get('/services/selection')
			.then(response => {
				setServicesSelectionList(response.data)
			})
			.catch(err => {
				console.error('Error creating studio:', err)
			})
			.finally(() => setIsLoading(false))
	}
	const handlePageChange = (page, pageSize = pagination.pageSize) => {
		fetchAppointments({ page, pageSize })
	}

	return {
		appointments,
		clientData,
		isLoading,
		servicesSelectionList,
		pagination,

		fetchAppointments,
		createAppointment,
		getAppointmentInfo,
		getServicesSelectionList,
		handlePageChange,
	}
}
