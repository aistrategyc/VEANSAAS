import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RecordsPage } from '../../pages/records/RecordsPage'
import { LoginPage } from '../../pages/login/LoginPage'
import { RegisterPage } from '../../pages/singUp/RegisterPage'
import { Loader } from '../../shared/ui/loader/Loader'
import { Layout } from '../../widgets/layout/Layout'
import { ClientsPage } from '../../pages/clients/ClientsPage'
import { DashboardPage } from '../../pages/dashboard/DashboardPage'
import { useAuth } from '../../shared/hooks/useAuth'

export const RouterProvider = () => {
	const { isAuthenticated, loading } = useAuth()

	const routes = useRoutes([
		{
			path: '/login',
			element: isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />,
		},
		{
			path: '/register',
			element: isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />,
		},
		{
			path: '/*',
			element: (
				<ProtectedRoute>
					<Layout>
						<Outlet />
					</Layout>
				</ProtectedRoute>
			),
			children: [
				{ index: true, element: <DashboardPage /> },
				{ path: 'records', element: <RecordsPage /> },
				{ path: 'clients', element: <ClientsPage /> },
				{ path: '*', element: <Navigate to='/' replace /> },
			],
		},
		{
			path: '/',
			element: <Navigate to={isAuthenticated ? '/' : '/login'} replace />,
		},
		{
			path: '*',
			element: <Navigate to='/' replace />,
		},
	])

	if (loading) {
		return <Loader />
	}

	return routes
}
