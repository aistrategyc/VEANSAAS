import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index.css'
import { RouterProvider } from './providers/RouterProvider'
import { store } from './store/store'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthProviderContext'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Provider store={store}>
			<AuthProvider>
				<RouterProvider />
			</AuthProvider>
		</Provider>
	</BrowserRouter>
)
