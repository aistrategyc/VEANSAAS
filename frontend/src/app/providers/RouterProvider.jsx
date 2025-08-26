import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from '../../pages/Login/LoginPage'
import { RegisterPage } from '../../pages/singUp/RegisterPage'
import { HomePage } from '../../pages/home/HomePage'
import { useAuth } from '../contexts/AuthProviderContext'
import { ProtectedRoute } from './ProtectedRoute'
import { Loader } from '../../shared/ui/loader/Loader'

export const RouterProvider = () => {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return <Loader />
	}
	return (
		<Routes>
			<Route
				exact
				path='/'
				element={
					<ProtectedRoute>
						<HomePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/login'
				element={isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />}
			/>
			<Route
				path='/register'
				element={
					isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />
				}
			/>
		</Routes>
	)
}
