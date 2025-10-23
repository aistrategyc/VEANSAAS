import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index.css'
import { RouterProvider } from './providers/RouterProvider'
import { store } from './store/store'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProviderContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Provider store={store}>
			<ThemeProvider defaultTheme='dark' storageKey='crypto-dashboard-theme'>
				<AuthProvider>
					<RouterProvider />
				</AuthProvider>
			</ThemeProvider>
			<Toaster
				position='top-right'
				toastOptions={{
					duration: 5000,
					style: {
						background: '#363636',
						color: '#fff',
					},
					success: {
						duration: 3000,
						theme: {
							primary: 'green',
							secondary: 'black',
						},
					},
					error: {
						duration: 6000,
						style: {
							background: '#f44336',
							color: '#fff',
						},
					},
				}}
			/>
		</Provider>
	</BrowserRouter>
)
