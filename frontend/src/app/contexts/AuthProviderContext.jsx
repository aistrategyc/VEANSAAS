import { useEffect, useState, useCallback } from 'react'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '@/shared/helper/cookie-utils'
import { AuthContext } from './AuthContext'
import { useUser } from '@/shared/hooks/useUser'

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const { fetchUser, fetchStudios } = useUser()

	const setAuth = useCallback((accessToken, refreshToken) => {
		setCookie('authToken', accessToken, 7)
		setCookie('refreshToken', refreshToken, 30)
		setIsAuthenticated(true)
	}, [])

	const logout = useCallback(() => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
		setIsAuthenticated(false)
	}, [])

	useEffect(() => {
		setIsLoading(true)
		const token = getCookie('authToken')
		if (token) {
			setIsAuthenticated(true)
			fetchUser()
			fetchStudios()
		} else {
			setIsAuthenticated(false)
		}

		setIsLoading(false)
	}, [])

	const value = {
		isAuthenticated,
		isLoading,
		setAuth,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
