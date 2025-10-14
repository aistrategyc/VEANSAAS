import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '@/shared/ui/loader/Loader'
import { useAuth } from '@/shared/hooks/useAuth'

export const ProtectedRoute = ({
	children,
	redirectTo = '/login',
	showLoader = true,
}) => {
	const { isAuthenticated, isLoading } = useAuth()
	const location = useLocation()

	if (isLoading && showLoader) {
		return <Loader />
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />
	}

	return children
}
