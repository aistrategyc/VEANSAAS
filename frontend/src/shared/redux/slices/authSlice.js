import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../../service/auth.service'

const initialState = {
	token: null,
	isLoading: false,
	isAuthenticated: false,
	error: null,
	registrationSuccess: false,
}

export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authService.login(credentials)

			return response
		} catch {
			return rejectWithValue(error.message)
		}
	}
)
export const registerUser = createAsyncThunk(
	'auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await authService.register(userData)

			return response
		} catch {
			return rejectWithValue(error.message)
		}
	}
)

const authSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: build => {
		build.addCase(loginUser.pending, state => {
			;(state.isLoading = true), (state.error = null)
		}),
			build.addCase(loginUser.fulfilled, (state, action) => {
				;(state.isLoading = false), (state.token = action.payload.access_token)
				state.isAuthenticated = true
				state.error = null
			})
		build.addCase(loginUser.rejected, (state, action) => {
			;(state.isAuthenticated = false),
				(state.token = null),
				(state.isLoading = false)
			state.error = action.payload.detail
		})
		build.addCase(registerUser.pending, state => {
			state.isLoading = true
			state.error = null
			state.registrationSuccess = false
		})

		build.addCase(registerUser.fulfilled, (state, action) => {
			state.isLoading = false
			state.registrationSuccess = true
			state.error = null
		})

		build.addCase(registerUser.rejected, (state, action) => {
			state.isLoading = false
			state.registrationSuccess = false
			state.error = action.payload
		})
	},
})

// export const { } = authSlice.actions

export default authSlice.reducer
