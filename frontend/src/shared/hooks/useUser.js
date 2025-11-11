import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData } from '@/shared/slices/userSlice'

export const useUser = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.rootReducer.user.data)
	const isLoading = useSelector(state => state.rootReducer.user.isLoading)
	const error = useSelector(state => state.rootReducer.user.error)

	return {
		user,
		isLoading,
		error,

		fetchUser: () => dispatch(fetchUserData()),
	}
}
