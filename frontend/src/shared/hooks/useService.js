import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchServices } from '@/shared/slices/servicesSlice'
import { fetchCategories } from '@/shared/slices/categoriesSlice'
import api from '@/shared/api/client'

export const useServices = () => {
	const dispatch = useDispatch()
	const { items, isLoading, error } = useSelector(
		state => state.rootReducer.services
	)

	const fetchServicesCallback = useCallback(() => {
		dispatch(fetchServices())
	}, [dispatch])

	return {
		data: items,
		isLoading,
		error,
		fetch: fetchServicesCallback,
	}
}

export const useCategories = () => {
	const dispatch = useDispatch()
	const { items, isLoading, error } = useSelector(
		state => state.rootReducer.categories
	)
	const [selections, setSelections] = useState([])
	const [isLoadingSelections, setIsLoadingSelections] = useState(false)
	const [selectionsError, setSelectionsError] = useState(null)

	const fetchCategoriesCallback = useCallback(() => {
		dispatch(fetchCategories())
	}, [dispatch])

	const fetchSelections = useCallback(async () => {
		setIsLoadingSelections(true)
		setSelectionsError(null)

		try {
			const response = await api.get('/services/categories/selection')
			setSelections(response.data)
		} catch (err) {
			setSelectionsError(err.message)
			console.error('Failed to fetch categories selection:', err)
		} finally {
			setIsLoadingSelections(false)
		}
	}, [])

	return {
		data: items,
		selections,
		isLoading,
		isLoadingSelections,
		error,
		selectionsError,
		fetch: fetchCategoriesCallback,
		fetchSelections,
	}
}

export const useService = () => {
	const services = useServices()
	const categories = useCategories()

	return {
		services,
		categories,
	}
}
