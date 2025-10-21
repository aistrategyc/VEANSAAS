import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Loader } from '@/shared/ui/loader/Loader'
import { Layout } from '@/widgets/layout/Layout'
import { useAuth } from '@/shared/hooks/useAuth'
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
import UserManager from '@/pages/roles/RolePage'
import CompatibilityPage from '@/pages/сompatibility/CompatibilityPage'
import ReportsPage from '@/pages/reports/ReportsPage'
import LocationsPage from '@/pages/locations/LocationsPage'
import SchedulePage from '@/pages/schedule/SchedulePage'
import DashboardPageNew from '@/pages/dashboard/DashboardPageNew'

import AppointmentDetailPage from '@/features/appointments/AppointmentDetailPage'
import ClientDetailPage from '@/features/clients/ClientDetailPage'
export const RouterProvider = () => {
	const { isAuthenticated, isLoading } = useAuth()

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
				{ path: 'dashboard', element: <DashboardPage /> },
				{
					path: 'clients',
					children: [
						{ index: true, element: <ClientsPage /> },
						{ path: ':uuid', element: <ClientDetailPage /> },
					],
				},
				{ path: 'calendar', element: <CalendarPage /> },
				{ path: 'records', element: <AppointmentsPage /> },
				{ path: 'staff', element: <StaffPage /> },
				{ path: 'services', element: <ServicesPage /> },
				{ path: 'studios', element: <StudiosPage /> },
				{ path: 'inventory', element: <InventoryPage /> },
				{ path: 'loyalty', element: <LoyaltyPage /> },
				{ path: 'finance', element: <FinancesPage /> },
				{ path: 'analytics', element: <AnalyticsPage /> },
				{ path: 'role', element: <UserManager /> },
				{ path: 'report', element: <ReportsPage /> },
				{ path: 'locations', element: <LocationsPage /> },
				{ path: 'schedule', element: <SchedulePage /> },
				{ path: 'dashboard-test', element: <DashboardPageNew /> },
				{ path: 'compatibility', element: <CompatibilityPage /> },
				{ path: 'records/1', element: <AppointmentDetailPage /> },

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
			path: '/verify-email',
			element: isAuthenticated ? (
				<Navigate to='/' replace />
			) : (
				<VerificationEmailPage />
			),
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

	if (isLoading) {
		return <Loader />
	}

	return routes
}
