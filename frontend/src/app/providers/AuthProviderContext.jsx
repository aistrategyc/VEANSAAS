import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../../shared/service/auth.service'

const AuthContext = createContext()

export const useAuthContext = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkAuth = () => {
			const authStatus = authService.isAuthenticated()
			setIsAuthenticated(authStatus)
			setLoading(false)
		}

		checkAuth()
	}, [])

	const value = {
		isAuthenticated,
		setIsAuthenticated,
		loading,
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
