import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index.css'
import { RouterProvider } from './providers/RouterProvider'
import { store } from './store/store'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<RouterProvider />
			</Provider>
		</BrowserRouter>
	</StrictMode>
)
