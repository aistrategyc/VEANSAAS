import { useSelector } from 'react-redux'

export const PermissionGuard = ({
	children,
	requiredPermission,
	requiredAny = [],
	requiredAll = [],
}) => {
	const roleId = useSelector(state => state.rootReducer.rolesCurrent.roleId)
	const roles = useSelector(state => state.rootReducer.roles?.roles)
	const role = roles.find(r => r.name === roleId)

	const permissions = role.permissions

	const hasPermission = requiredPermission => {
		if (!requiredPermission) return true
		return permissions.includes(requiredPermission)
	}

	const hasAnyPermission = requiredPermissions => {
		if (!requiredPermissions || requiredPermissions.length === 0) return true
		return requiredPermissions.some(permission =>
			permissions.includes(permission)
		)
	}

	const hasAllPermissions = requiredPermissions => {
		if (!requiredPermissions || requiredPermissions.length === 0) return true
		return requiredPermissions.every(permission =>
			permissions.includes(permission)
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
