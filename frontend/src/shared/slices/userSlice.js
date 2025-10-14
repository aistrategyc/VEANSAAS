import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/shared/api/client'
import { getCookie } from '@/shared/helper/cookie-utils'

export const fetchUserData = createAsyncThunk(
	'user/fetchUserData',
	async (_, { rejectWithValue }) => {
		try {
			const token = getCookie('authToken')

			if (!token) {
				return rejectWithValue('Token error')
			}
			const response = await api.get('/users/me')

			return response.data
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

const userSLice = createSlice({
	name: 'user',
	initialState: {
		data: null,
		isLoading: false,
		error: null,
	},
	reducers: {
		updateUserData: (state, action) => {
			if (state.data) {
				state.data = { ...state.data, ...action.payload }
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchUserData.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchUserData.fulfilled, (state, action) => {
				state.isLoading = false
				state.data = action.payload
				state.error = null
			})
			.addCase(fetchUserData.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const { logout, updateUserData } = userSLice.actions
export default userSLice.reducer
