import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData, logout } from '../../shared/slices/userSlice'
import { fetchStudios } from '../slices/studiosSlice'

export const useUser = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.rootReducer.user.data)
	const studios = useSelector(state => state.rootReducer.studios.items)
	const loading = useSelector(state => state.rootReducer.user.isLoading)
	const error = useSelector(state => state.rootReducer.user.error)

	return {
		user,
		loading,
		error,
		studios,
		fetchUser: () => dispatch(fetchUserData()),
		fetchStudios: () => dispatch(fetchStudios()),
		logout: () => dispatch(logout()),
	}
}
