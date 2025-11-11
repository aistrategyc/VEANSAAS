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
			/>
		</Provider>
	</BrowserRouter>
)
