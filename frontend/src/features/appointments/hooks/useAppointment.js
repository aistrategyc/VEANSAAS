import { useState } from 'react'
import api from '@/shared/api/client'

export const useAppointment = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [appointments, setAppointments] = useState([])
	const [clientData, setClientData] = useState({})
	const [servicesSelectionList, setServicesSelectionList] = useState([])

	const fetchAppointments = (params = {}) => {
		setIsLoading(true)

		api
			.get('/appointments', { params })
			.then(response => {
				setAppointments(response.data.items)
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
				return response.data
			})
			.catch(err => {
				console.error('Error creating studio:', err)
			})
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

	return {
		appointments,
		clientData,
		isLoading,
		servicesSelectionList,

		fetchAppointments,
		createAppointment,
		getAppointmentInfo,
		getServicesSelectionList,
	}
}
