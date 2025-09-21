import { useEffect, useState, useCallback } from 'react'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '../../shared/helper/authHelper'
import { AuthContext } from './AuthContext'
import { useUser } from '../../shared/hooks/useUser'
import { parseJwt } from '@/shared/api/api'
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	const { fetchUser } = useUser()

	const login = useCallback((accessToken, refreshToken, options = {}) => {
		const { expires = 7 } = options
		setCookie('authToken', accessToken, expires)
		setCookie('refreshToken', refreshToken)

		setIsAuthenticated(true)
	}, [])

	const logout = useCallback(() => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
		setIsAuthenticated(false)
	}, [])

	useEffect(() => {
		const token = getCookie('authToken')
		if (token) {
			setIsAuthenticated(true)
			fetchUser()
		} else {
			setIsAuthenticated(false)
		}

		setLoading(false)
	}, [])

	const value = {
		isAuthenticated,
		loading,
		login,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
