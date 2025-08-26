import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from './AuthProviderContext'
import { Loader } from '../../shared/ui/loader/Loader'

export const ProtectedRoute = ({
	children,
	redirectTo = '/login',
	showLoader = true,
}) => {
	const { isAuthenticated, loading } = useAuthContext()
	const location = useLocation()

	if (loading && showLoader) {
		return <Loader />
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />
	}

	return children
}
