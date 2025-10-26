import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/shared/api/client'

export const fetchServices = createAsyncThunk(
	'services/fetchServices',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/services')
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка загрузки услуг')
		}
	}
)

export const createService = createAsyncThunk(
	'services/createService',
	async (serviceData, { rejectWithValue }) => {
		try {
			const response = await api.post('/services', serviceData)
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка создания услуги')
		}
	}
)

export const updateService = createAsyncThunk(
	'services/updateService',
	async ({ uuid, serviceData }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/services/${uuid}`, serviceData)
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка обновления услуги')
		}
	}
)

export const deleteService = createAsyncThunk(
	'services/deleteService',
	async (uuid, { rejectWithValue }) => {
		try {
			await api.delete(`/services/${uuid}`)
			return uuid
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка удаления услуги')
		}
	}
)

const servicesSlice = createSlice({
	name: 'services',
	initialState: {
		items: {
			items: [],
			pagination: {},
		},
		searchQuery: '',
		categoryFilter: 'all',
		isLoading: false,
		isLoaded: false,
		error: null,
	},
	reducers: {
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload
		},
		setCategoryFilter: (state, action) => {
			state.categoryFilter = action.payload
		},
		clearFilters: state => {
			state.searchQuery = ''
			state.categoryFilter = 'all'
		},
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
				state.items.items = action.payload
				state.isLoaded = true
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			.addCase(createService.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createService.fulfilled, (state, action) => {
				state.isLoading = false
				state.items.items.push(action.payload)
				state.items.pagination = {
					...state.items.pagination,
					count: state.items.pagination.count + 1,
				}
			})
			.addCase(createService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			.addCase(updateService.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(updateService.fulfilled, (state, action) => {
				state.isLoading = false
				const index = state.items.findIndex(
					item => item.uuid === action.payload.uuid
				)
				if (index !== -1) {
					state.items[index] = action.payload
				}
			})
			.addCase(updateService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(deleteService.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(deleteService.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = state.items.items.filter(item => item.uuid !== action.payload)
				state.items.pagination = {
					...state.items.pagination,
					count: state.items.pagination.count - 1,
				}
			})
			.addCase(deleteService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const { setSearchQuery, setCategoryFilter, clearFilters, clearError } =
	servicesSlice.actions
export default servicesSlice.reducer
