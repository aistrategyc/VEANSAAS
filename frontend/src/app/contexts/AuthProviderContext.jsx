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
import { setRoles, clearRoles } from '@/shared/slices/rolesSlice'
import { clearCurrentStudio } from '@/shared/slices/studiosSlice'

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const dispatch = useDispatch()

	const { fetchUser, fetchStudios } = useUser()

	const setAuth = useCallback((accessToken, refreshToken) => {
		setCookie('authToken', accessToken, 7)
		setCookie('refreshToken', refreshToken, 30)
		const dataJwt = parseJwt(accessToken)
		dispatch(
			setRoles({
				roles: dataJwt?.roles || { orgs: {}, studios: {} },
				permissions: dataJwt?.permissions || {},
				orgUuid: dataJwt?.organization_uuid || null,
			})
		)
		setIsAuthenticated(true)
	}, [])

	const logout = useCallback(() => {
		deleteCookie('authToken')
		deleteCookie('refreshToken')
		dispatch(clearRoles())
		dispatch(clearCurrentStudio())
		setIsAuthenticated(false)
	}, [])

	useEffect(() => {
		setIsLoading(true)
		const token = getCookie('authToken')
		if (token) {
			setIsAuthenticated(true)
			fetchUser()
			fetchStudios()
			const dataJwt = parseJwt(token)
			dispatch(
				setRoles({
					roles: dataJwt?.roles || { orgs: {}, studios: {} },
					permissions: dataJwt?.permissions || {},
					orgUuid: dataJwt?.organization_uuid || null,
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
