import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	value: 5,
}

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		changeValue: state => {
			state.value = 4
		},
	},
})

export default counterSlice.reducer
export const { changeValue } = counterSlice.actions
