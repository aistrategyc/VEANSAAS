import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Loader } from '../../shared/ui/loader/Loader'
import { Layout } from '../../widgets/layout/Layout'
import { useAuth } from '../../shared/hooks/useAuth'
import ClientsPage from '@/pages/clients/ClientsPage'
import CalendarPage from '@/pages/calendar/CalendarPage'
import AppointmentsPage from '@/pages/appointments/AppointmentsPage'
import StaffPage from '@/pages/staff/StaffPage'
import ServicesPage from '@/pages/services/ServicesPage'
import StudiosPage from '@/pages/studios/StudiosPage'
import InventoryPage from '@/pages/inventory/InventoryPage'
import LoyaltyPage from '@/pages/loyalty/LoyaltyPage'
import FinancesPage from '@/pages/finances/FinancesPage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import { AuthPage } from '@/pages/auth/AuthPage'
import MainPage from '@/pages/main/MainPage'
import VerificationEmailPage from '@/pages/auth/VerificationEmailPage'
import { RegisterSimple } from '@/pages/auth/RegisterSimple'
import DashboardPage from '@/pages/dashboard/DashboardPage'

export const RouterProvider = () => {
	const { isAuthenticated, loading } = useAuth()

	const routes = useRoutes([
		{
			path: '/login',
			element: isAuthenticated ? <Navigate to='/' replace /> : <AuthPage />,
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
				{ index: true, element: <MainPage /> },
				{ path: 'clients', element: <ClientsPage /> },
				{ path: 'calendar', element: <CalendarPage /> },
				{ path: 'records', element: <AppointmentsPage /> },
				{ path: 'staff', element: <StaffPage /> },
				{ path: 'services', element: <ServicesPage /> },
				{ path: 'studios', element: <StudiosPage /> },
				{ path: 'inventory', element: <InventoryPage /> },
				{ path: 'loyalty', element: <LoyaltyPage /> },
				{ path: 'finance', element: <FinancesPage /> },
				{ path: 'analytics', element: <AnalyticsPage /> },
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
		{
			path: '/verification',
			element: <VerificationEmailPage />,
		},
		{
			path: '/register-invite',
			element: isAuthenticated ? (
				<Navigate to='/' replace />
			) : (
				<RegisterSimple />
			),
		},
		{
			path: '/dashboard',
			element: <DashboardPage />,
		},
	])

	if (loading) {
		return <Loader />
	}

	return routes
}
