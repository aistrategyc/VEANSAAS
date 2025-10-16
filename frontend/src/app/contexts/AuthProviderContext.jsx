import { useEffect, useState, useCallback } from 'react'
import {
	deleteCookie,
	getCookie,
	setCookie,
} from '../../shared/helper/authHelper'
import { AuthContext } from './AuthContext'
import { useUser } from '../../shared/hooks/useUser'
import { useDispatch } from 'react-redux'
import { parseJwt } from '@/shared/api/api'
import { setRoles, clearRoles } from '@/role/slice/rolesSlice'
import { clearCurrentStudio } from '@/shared/slices/studiosSlice'

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)
	const dispatch = useDispatch()

	const { fetchUser, fetchStudios } = useUser()

	const login = useCallback((accessToken, refreshToken, options = {}) => {
		const { expires = 7 } = options
		setCookie('authToken', accessToken, expires)
		setCookie('refreshToken', refreshToken)
		const dataJwt = parseJwt(accessToken)
		dispatch(
			setRoles({
				roles: dataJwt?.roles || [],
				permissions: dataJwt?.permissions || [],
				org_uuid: dataJwt?.organization_uuid || null,
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
		const token = getCookie('authToken')
		if (token) {
			setIsAuthenticated(true)
			fetchUser()
			fetchStudios()
			const dataJwt = parseJwt(token)
			dispatch(
				setRoles({
					roles: dataJwt?.roles || [],
					permissions: dataJwt?.permissions || [],
					org_uuid: dataJwt?.organization_uuid || null,
				})
			)
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
