import { mockUsers } from './mocks/rolesMock'

const currentRole = 'user'

const permissions = mockUsers.find(
	user => user.role === currentRole
).permissions

const hasPermission = requiredPermission => {
	console.log(permissions.includes(requiredPermission))
	if (!requiredPermission) return true
	return permissions.includes(requiredPermission[0])
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
export const PermissionGuard = ({
	children,
	requiredPermission,
	requiredAny = [],
	requiredAll = [],
}) => {
	let hasAccess = true

	if (requiredPermission) {
		hasAccess = hasPermission(requiredPermission)
	} else if (requiredAny.length > 0) {
		hasAccess = hasAnyPermission(requiredAny)
	} else if (requiredAll.length > 0) {
		hasAccess = hasAllPermissions(requiredAll)
	}

	return hasAccess ? children : <div>нету прав</div>
}
