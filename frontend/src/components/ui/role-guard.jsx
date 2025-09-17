import { NoAccessState } from './no-access-state'

export function RoleGuard({ allowedRoles, children, fallback }) {
	const user = { role: 'admin' }

	if (!user || !allowedRoles.includes(user.role)) {
		return fallback || <NoAccessState />
	}

	return <>{children}</>
}
