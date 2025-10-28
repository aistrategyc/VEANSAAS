import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchServices,
	createService,
	updateService,
	deleteService,
} from '@/shared/slices/servicesSlice'
import {
	createAttribute,
	deleteAttribute,
	fetchCategories,
} from '../slices/categoriesSlice'
import api from '@/shared/api/client'

export const useServices = (pageSize = 10) => {
	const dispatch = useDispatch()
	const { items, pagination, isLoading, error } = useSelector(
		state => state.rootReducer.services
	)

	const [currentPage, setCurrentPage] = useState(1)

	const fetch = useCallback(
		(page = 1) => {
			const offset = (page - 1) * pageSize
			dispatch(fetchServices({ offset, limit: pageSize }))
		},
		[dispatch]
	)

	const handlePageChange = page => {
		if (page < 1) return
		setCurrentPage(page)
		fetch(page)
	}

	return {
		items,
		pagination,
		isLoading,
		error,
		currentPage,
		handlePageChange,
		create: data => dispatch(createService(data)),
		update: (uuid, data) =>
			dispatch(updateService({ uuid, serviceData: data })),
		remove: uuid => dispatch(deleteService(uuid)),
		fetch,
	}
}

export const useCategories = () => {
	const dispatch = useDispatch()
	const { items, pagination, isLoading, error } = useSelector(
		state => state.rootReducer.categories
	)
	const [selections, setSelections] = useState([])

	const fetch = useCallback(() => {
		dispatch(fetchCategories())
	}, [dispatch])

	const createAttributeAction = useCallback(
		data => {
			return dispatch(createAttribute(data))
		},
		[dispatch]
	)

	const deleteAttributeAction = useCallback(
		(categoryUuid, uuid) => {
			return dispatch(deleteAttribute({ categoryUuid, uuid }))
		},
		[dispatch]
	)
	const fetchSelections = useCallback(async () => {
		try {
			const response = await api.get('/services/categories/selection')
			setSelections(response.data)
		} catch (err) {
			console.error('Ошибка при загрузке списка категорий:', err)
		}
	}, [])

	return {
		data: { items, selections, pagination },
		isLoading,
		error,
		fetch,
		fetchSelections,
		createAttribute: createAttributeAction,
		deleteAttribute: deleteAttributeAction,
	}
}

export const useService = () => {
	const services = useServices()
	const categories = useCategories()
	return { services, categories }
}
