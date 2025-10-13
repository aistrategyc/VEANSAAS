import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData, logout } from '../slices/userSlice'
import { fetchStudios } from '../slices/studiosSlice'

export const useStudio = () => {
	const dispatch = useDispatch()
	const studios = useSelector(state => state.rootReducer.studios.items)
	const filteredStudios = useSelector(
		state => state.rootReducer.studios.filteredItems
	)
	const loading = useSelector(state => state.rootReducer.studios.isLoading)
	const error = useSelector(state => state.rootReducer.studios.error)

	return {
		loading,
		error,
		studios,
		filteredStudios,
		fetchStudios: () => dispatch(fetchStudios()),
	}
}
