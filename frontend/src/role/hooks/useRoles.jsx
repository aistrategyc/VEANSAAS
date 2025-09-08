// hooks/useRoles.js
import { useSelector, useDispatch } from 'react-redux'
import {
	selectAllRoles,
	selectCurrentUserRole,
	selectCurrentUserPermissions,
} from '../slice/rolesSlice'

export const useRoles = () => {
	const dispatch = useDispatch()
	const roles = useSelector(selectAllRoles)
	const currentUserRole = useSelector(selectCurrentUserRole)
	const currentUserPermissions = useSelector(selectCurrentUserPermissions)

	const changeUserRole = role => {
		dispatch(setUserRole(role))
	}

	const hasRole = role => {
		return 'admin' === role
	}

	const hasAnyRole = rolesArray => {
		return rolesArray.includes(currentUserRole)
	}

	return {
		roles,
		currentUserRole,
		currentUserPermissions,
		changeUserRole,
		hasRole,
		hasAnyRole,
	}
}
