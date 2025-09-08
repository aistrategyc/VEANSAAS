// hooks/usePermissions.js
import { useSelector } from 'react-redux'

const userPermissions = [
	'user:create',
	'user:read',
	'user:update',
	'user:delete',
	'report:view',
	'report:edit',
	'settings:read',
	'settings:write',
	'dashboard:view',
	'analytics:view',
]

export const usePermissions = () => {
	const permissions = useSelector(userPermissions)

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

	return {
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		permissions,
	}
}
