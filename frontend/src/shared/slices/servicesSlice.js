import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '@/shared/api/api'

// Асинхронные действия для услуг
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
		items: [],
		filteredItems: [],
		searchQuery: '',
		categoryFilter: 'all',
		isLoading: false,
		isLoaded: false,
		error: null,
	},
	reducers: {
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload
			state.filteredItems = filterServices(state.items, state)
		},
		setCategoryFilter: (state, action) => {
			state.categoryFilter = action.payload
			state.filteredItems = filterServices(state.items, state)
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
			// Fetch Services
			.addCase(fetchServices.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = action.payload
				state.filteredItems = filterServices(action.payload, state)
				state.isLoaded = true
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			// Create Service
			.addCase(createService.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createService.fulfilled, (state, action) => {
				state.isLoading = false
				state.items.push(action.payload)
				state.filteredItems = filterServices(state.items, state)
			})
			.addCase(createService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			// Update Service
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
					state.filteredItems = filterServices(state.items, state)
				}
			})
			.addCase(updateService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			// Delete Service
			.addCase(deleteService.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(deleteService.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = state.items.filter(item => item.uuid !== action.payload)
				state.filteredItems = filterServices(state.items, state)
			})
			.addCase(deleteService.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

// Простая функция фильтрации
const filterServices = (services, filters) => {
	return services.filter(service => {
		const matchesSearch =
			filters.searchQuery === '' ||
			service.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			(service.description &&
				service.description
					.toLowerCase()
					.includes(filters.searchQuery.toLowerCase()))

		const matchesCategory =
			filters.categoryFilter === 'all' ||
			service.category_uuid === filters.categoryFilter

		return matchesSearch && matchesCategory
	})
}

export const { setSearchQuery, setCategoryFilter, clearFilters, clearError } =
	servicesSlice.actions
export default servicesSlice.reducer
