import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '../../shared/ui/loader/Loader'
import { useAuth } from '../../shared/hooks/useAuth'

export const ProtectedRoute = ({
	children,
	redirectTo = '/login',
	showLoader = true,
}) => {
	const { isAuthenticated, loading } = useAuth()
	const location = useLocation()

	if (loading && showLoader) {
		return <Loader />
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />
	}

	return children
}
