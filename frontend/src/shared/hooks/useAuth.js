import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../redux/slices/authSlice'

export const useAuth = () => {
	const dispatch = useDispatch()
	const authState = useSelector(state => state.rootReducer.auth)

	const login = useCallback(
		credentials => {
			const res = dispatch(loginUser(credentials))
			return res
		},
		[dispatch]
	)

	const register = useCallback(
		registrationData => {
			return dispatch(registerUser(registrationData))
		},
		[dispatch]
	)

	return {
		toke: authState.token,
		isLoading: authState.isLoading,
		isAuthenticated: authState.isAuthenticated,
		error: authState.error,
		registerSuccess: authState.registerSuccess,

		login,
		register,
	}
}
