import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/client'

export const fetchServices = createAsyncThunk(
	'services/fetchServices',
	async ({ offset = 0, limit = 10 }, thunkAPI) => {
		try {
			const response = await api.get('/services', { params: { offset, limit } })
			return response.data
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data || 'Ошибка загрузки услуг'
			)
		}
	}
)

export const createService = createAsyncThunk(
	'services/createService',
	async (serviceData, thunkAPI) => {
		try {
			const response = await api.post('/services', serviceData)
			return response.data
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data || 'Ошибка при создании'
			)
		}
	}
)

export const updateService = createAsyncThunk(
	'services/updateService',
	async ({ uuid, serviceData }, thunkAPI) => {
		try {
			const response = await api.put(`/services/${uuid}`, serviceData)
			return response.data
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data || 'Ошибка при обновлении'
			)
		}
	}
)

export const deleteService = createAsyncThunk(
	'services/deleteService',
	async (uuid, thunkAPI) => {
		try {
			await api.delete(`/services/${uuid}`)
			return uuid
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data || 'Ошибка при удалении'
			)
		}
	}
)

const servicesSlice = createSlice({
	name: 'services',
	initialState: {
		items: [],
		pagination: {
			count: 0,
			offset: 0,
			limit: 10,
			has_more: false,
		},
		isLoading: false,
		isLoaded: false,
		error: null,
	},

	reducers: {
		clearError: state => {
			state.error = null
		},
	},

	extraReducers: builder => {
		builder
			.addCase(fetchServices.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.isLoading = false
				state.isLoaded = true

				const { items, pagination } = action.payload
				state.items = items
				state.pagination = pagination
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(createService.fulfilled, (state, action) => {
				state.items.unshift(action.payload)
				state.pagination.count += 1
			})
			.addCase(updateService.fulfilled, (state, action) => {
				const index = state.items.findIndex(s => s.uuid === action.payload.uuid)
				if (index !== -1) state.items[index] = action.payload
			})
			.addCase(deleteService.fulfilled, (state, action) => {
				state.items = state.items.filter(s => s.uuid !== action.payload)
				state.pagination.count -= 1
			})
	},
})

export const { clearError } = servicesSlice.actions
export default servicesSlice.reducer
