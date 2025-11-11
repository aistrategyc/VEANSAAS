import { useSelector } from 'react-redux'

export const PermissionGuard = ({
	children,
	requiredPermission,
	requiredAny = [],
	requiredAll = [],
	scope = 'orgs',
}) => {
	const roles = useSelector(state => state.rootReducer.user?.data?.roles)
	const orgUuid = useSelector(state => state.rootReducer.roles?.orgUuid)
	const permissionsConfig = useSelector(
		state => state.rootReducer.roles.permissions
	)
	const currentStudio = localStorage.getItem('currentStudioUuid')

	const getUserRoles = () => {
		if (scope === 'studio' && currentStudio) {
			return roles?.studios?.[currentStudio] || []
		} else if (scope === 'orgs' && orgUuid) {
			return roles?.orgs?.[orgUuid] || []
		}
		return []
	}

	const getAllPermissions = () => {
		const userRoles = getUserRoles()
		const allPermissions = []

		userRoles.forEach(role => {
			const rolePermissions = permissionsConfig?.[role]?.permissions || []
			allPermissions.push(...rolePermissions)
		})

		return [...new Set(allPermissions)]
	}

	const hasPermission = requiredPermission => {
		if (!requiredPermission) return true

		const userRoles = getUserRoles()
		if (userRoles.length === 0) return false

		return userRoles.some(role => {
			const rolePermissions = permissionsConfig?.[role]?.permissions || []
			return rolePermissions.includes(requiredPermission)
		})
	}

	const hasAnyPermission = requiredPermissions => {
		if (!requiredPermissions || requiredPermissions.length === 0) return true

		const userRoles = getUserRoles()
		if (userRoles.length === 0) return false

		return requiredPermissions.some(requiredPermission =>
			userRoles.some(role => {
				const rolePermissions = permissionsConfig?.[role]?.permissions || []
				return rolePermissions.includes(requiredPermission)
			})
		)
	}

	const hasAllPermissions = requiredPermissions => {
		if (!requiredPermissions || requiredPermissions.length === 0) return true

		const userRoles = getUserRoles()
		if (userRoles.length === 0) return false

		const allPermissions = getAllPermissions()

		return requiredPermissions.every(permission =>
			allPermissions.includes(permission)
		)
	}

	let hasAccess = true

	if (requiredPermission) {
		hasAccess = hasPermission(requiredPermission)
	} else if (requiredAny.length > 0) {
		hasAccess = hasAnyPermission(requiredAny)
	} else if (requiredAll.length > 0) {
		hasAccess = hasAllPermissions(requiredAll)
	}

	return hasAccess ? children : null
}
