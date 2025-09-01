import { useEffect, useState, useCallback } from 'react'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '../../shared/helper/authHelper'
import { AuthContext } from './AuthContext'
import { useUser } from '../../shared/hooks/useUser'
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	const { fetchUser } = useUser()

	const login = useCallback((token, options = {}) => {
		const { expires = 7 } = options
		console.log('token', token)

		setCookie('authToken', token, expires)
		setIsAuthenticated(true)
	}, [])

	const logout = useCallback(() => {
		deleteCookie('authToken')
		setIsAuthenticated(false)
	}, [])

	useEffect(() => {
		const token = getCookie('authToken')

		if (token) {
			setIsAuthenticated(true)
			// fetchUser()
			console.log(1)
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
