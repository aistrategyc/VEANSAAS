import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

export const store = configureStore({
	reducer: {
		rootReducer,
	},
	// Дополнительные опции (опционально)
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
	devTools: process.env.NODE_ENV !== 'production',
})
