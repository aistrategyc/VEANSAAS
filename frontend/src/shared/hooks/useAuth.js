// // hooks/useAuth.js
// import { useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import {
// 	loginUser,
// 	registerUser,
// 	logoutUser,
// 	clearError,
// } from '../store/slices/authSlice'
// import { authService } from '../services/auth.service'

// export const useAuth = () => {
// 	const dispatch = useDispatch()
// 	const authState = useSelector(state => state.auth)

// 	const login = useCallback(
// 		async credentials => {
// 			try {
// 				const result = await dispatch(loginUser(credentials))
// 				return result
// 			} catch (error) {
// 				throw error
// 			}
// 		},
// 		[dispatch]
// 	)

// 	// const register = useCallback(
// 	// 	async userData => {
// 	// 		try {
// 	// 			const result = await dispatch(registerUser(userData)).unwrap()
// 	// 			return result
// 	// 		} catch (error) {
// 	// 			throw error
// 	// 		}
// 	// 	},
// 	// 	[dispatch]
// 	// )

// 	const logout = useCallback(async () => {
// 		try {
// 			await dispatch(logoutUser()).unwrap()
// 		} catch (error) {
// 			console.error('Logout error:', error)
// 		}
// 	}, [dispatch])

// 	const clearAuthError = useCallback(() => {
// 		dispatch(clearError())
// 	}, [dispatch])

// 	const isAuthenticated = useCallback(() => {
// 		return authService.isAuthenticated()
// 	}, [])

// 	const getToken = useCallback(() => {
// 		return authService.getToken()
// 	}, [])

// 	const getUser = useCallback(() => {
// 		return authService.getUser()
// 	}, [])

// 	return {
// 		// State
// 		user: authState.user,
// 		token: authState.token,
// 		isAuthenticated: authState.isAuthenticated,
// 		isLoading: authState.isLoading,
// 		error: authState.error,

// 		// Actions
// 		login,
// 		register,
// 		logout,
// 		clearError: clearAuthError,
// 		isAuthenticated: isAuthenticated,
// 		getToken,
// 		getUser,
// 	}
// }
