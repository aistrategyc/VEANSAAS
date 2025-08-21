import { configureStore } from '@reduxjs/toolkit'
import counter from './slices/counterSlice'

export const store = configureStore({
	reducer: {
		counter,
	},
})
