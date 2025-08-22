import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	value: 5,
}

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: state => {
			state.value -= 1
		},
		decrement: state => {
			state.value += 1
		},
	},
})

export default counterSlice.reducer
export const { increment, decrement } = counterSlice.actions
