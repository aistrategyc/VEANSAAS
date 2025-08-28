import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData, logout } from '../../shared/slices/userSlice'

export const useUser = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.rootReducer.user.data)
	const loading = useSelector(state => state.rootReducer.user.isLoading)
	const error = useSelector(state => state.rootReducer.user.error)

	return {
		user,
		loading,
		error,
		fetchUser: () => dispatch(fetchUserData()),
		logout: () => dispatch(logout()),
	}
}
