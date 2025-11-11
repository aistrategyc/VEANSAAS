import { useEffect, useState, useCallback } from 'react'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '@/shared/helper/cookie-utils'
import { AuthContext } from './AuthContext'
import { useUser } from '@/shared/hooks/useUser'
import { useDispatch } from 'react-redux'
import { parseJwt } from '@/shared/helper/jwt-helpers'
import { setRoles, clearRoles, setPermissions } from '@/shared/slices/rolesSlice'

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const dispatch = useDispatch()

	const { fetchUser } = useUser()

	const setAuth = useCallback((accessToken, refreshToken) => {
		setCookie('authToken', accessToken, 7)
		setCookie('refreshToken', refreshToken, 30)
		const dataJwt = parseJwt(accessToken)
		dispatch(
			setPermissions({
				permissions: dataJwt?.permissions || {},
			})
		)
		setIsAuthenticated(true)
	}, [])

	const logout = useCallback(() => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
		dispatch(clearRoles())
		localStorage.removeItem('currentStudioUuid')
		setIsAuthenticated(false)
	}, [])

	useEffect(() => {
		setIsLoading(true)
		const token = getCookie('authToken')
		if (token) {
			setIsAuthenticated(true)
			fetchUser()
			const dataJwt = parseJwt(token)
			dispatch(
				setPermissions({
					permissions: dataJwt?.permissions || {},
				})
			)
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
