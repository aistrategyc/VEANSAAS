import { useState } from 'react'
import api from '@/shared/api/client'

export const useClient = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [clients, setClients] = useState([])
	const [clientData, setClientData] = useState({})
	const [clientSelectionList, setClientSelectionList] = useState([])

	const fetchClients = (params = {}) => {
		setIsLoading(true)

		api
			.get('/customers', { params })
			.then(response => {
				setClients(response.data.items)
			})
			.catch(err => {
				console.error('Error fetching studios:', err)
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

	return {
		clients,
		clientData,
		isLoading,
		clientSelectionList,

		fetchClients,
		createClient,
		updateClient,
		getClientInfo,
		getClientSelectionList,
	}
}
