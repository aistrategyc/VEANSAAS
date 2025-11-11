import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
	fetchStudios,
	fetchStudiosSelection,
	createStudio,
	updateStudio,
	setCurrentStudio,
	handlePageChange,
} from '@/shared/slices/studiosSlice'

const useStudios = () => {
	const dispatch = useDispatch()

	const {
		items,
		studiosSelection,
		currentStudio,
		isLoading,
		pagination,
		error,
	} = useSelector(state => state.rootReducer.studios)

	const fetchStudiosHandler = useCallback(
		(params = {}) => {
			dispatch(fetchStudios(params))
		},
		[dispatch]
	)

	const fetchStudiosSelectionHandler = useCallback(() => {
		dispatch(fetchStudiosSelection())
	}, [dispatch])

	const createStudioHandler = useCallback(
		data => {
			return dispatch(createStudio(data)).unwrap()
		},
		[dispatch]
	)

	const updateStudioHandler = useCallback(
		(uuid, data) => {
			return dispatch(updateStudio({ uuid, data })).unwrap()
		},
		[dispatch]
	)

	const handleStudioChange = useCallback(
		studio => {
			dispatch(setCurrentStudio(studio))
		},
		[dispatch]
	)

	const handlePageChangeHandler = useCallback(
		(page, pageSize) => {
			dispatch(handlePageChange({ page, pageSize }))
			dispatch(fetchStudios({ page, pageSize }))
		},
		[dispatch]
	)

	return {
		// State
		studios: items,
		studiosSelection,
		currentStudio,
		isLoading,
		pagination,
		error,

		// Actions
		fetchStudios: fetchStudiosHandler,
		fetchStudiosSelection: fetchStudiosSelectionHandler,
		createStudio: createStudioHandler,
		updateStudio: updateStudioHandler,
		handleStudioChange,
		handlePageChange: handlePageChangeHandler,
	}
}
export default useStudios
