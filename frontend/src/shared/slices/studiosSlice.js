import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/shared/api/client'

export const fetchStudios = createAsyncThunk(
	'studios/fetchStudios',
	async (params = {}, { rejectWithValue }) => {
		try {
			const apiParams = {
				offset: ((params.page || 1) - 1) * (params.pageSize || 4),
				limit: params.pageSize || 4,
				...params,
			}
			delete apiParams.page
			delete apiParams.pageSize

			const response = await api.get('/studios', { params: apiParams })
			return {
				data: response.data,
				page: params.page || 1,
				pageSize: params.pageSize || 4,
			}
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка загрузки студий')
		}
	}
)

export const fetchStudiosSelection = createAsyncThunk(
	'studios/fetchStudiosSelection',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/studios/selection')
			return response.data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка загрузки списка студий'
			)
		}
	}
)

export const createStudio = createAsyncThunk(
	'studios/createStudio',
	async (data, { rejectWithValue }) => {
		try {
			const response = await api.post('/studios', data)
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка создания студии')
		}
	}
)

export const updateStudio = createAsyncThunk(
	'studios/updateStudio',
	async ({ uuid, data }, { rejectWithValue }) => {
		try {
			const response = await api.patch(`/studios/${uuid}`, data)
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка обновления студии')
		}
	}
)

const studiosSlice = createSlice({
	name: 'studios',
	initialState: {
		items: [],
		studiosSelection: [],
		currentStudio: null,
		isLoading: false,
		pagination: {
			currentPage: 1,
			pageSize: 4,
			totalCount: 0,
			hasMore: false,
		},
		error: null,
	},
	reducers: {
		setCurrentStudio: (state, action) => {
			state.currentStudio = action.payload
			localStorage.setItem('currentStudioUuid', action.payload.uuid)
		},
		handlePageChange: (state, action) => {
			const { page, pageSize = state.pagination.pageSize } = action.payload
			state.pagination.currentPage = page
			state.pagination.pageSize = pageSize
		},
		clearCurrentStudio: state => {
			state.currentStudio = null
			localStorage.removeItem('currentStudioUuid')
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchStudios.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchStudios.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = action.payload.data
				state.pagination = {
					...state.pagination,
					currentPage: action.payload.page,
					pageSize: action.payload.pageSize,
					totalCount: action.payload.data.pagination?.count || 0,
					hasMore: action.payload.data.pagination?.has_more || false,
				}
			})
			.addCase(fetchStudios.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(fetchStudiosSelection.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchStudiosSelection.fulfilled, (state, action) => {
				state.isLoading = false
				state.studiosSelection = action.payload

				const currentStudioUuid = localStorage.getItem('currentStudioUuid')
				if (!currentStudioUuid && action.payload.length > 0) {
				
					state.currentStudio = action.payload[0]
					localStorage.setItem('currentStudioUuid', action.payload[0].uuid)
				} else if (currentStudioUuid) {
					
					const savedStudio = action.payload.find(
						item => item.uuid === currentStudioUuid
					)
					if (savedStudio) {
						state.currentStudio = savedStudio
					} else if (action.payload.length > 0) {
					
						state.currentStudio = action.payload[0]
						localStorage.setItem('currentStudioUuid', action.payload[0].uuid)
					}
				}
			})
			.addCase(fetchStudiosSelection.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			
			.addCase(createStudio.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createStudio.fulfilled, (state, action) => {
				state.isLoading = false
				state.items.items = [...state.items.items, action.payload]
				state.pagination.totalCount += 1
				state.studiosSelection = [
					...state.studiosSelection,
					{
						name: action.payload.name,
						uuid: action.payload.uuid
					},
				]
			})
			.addCase(createStudio.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			
			.addCase(updateStudio.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(updateStudio.fulfilled, (state, action) => {
				state.isLoading = false
				if (state.items.items) {
					state.items.items = state.items.items.map(studio =>
						studio.uuid === action.payload.uuid ? action.payload : studio
					)
				}

				
				if (state.studiosSelection) {
					state.studiosSelection = state.studiosSelection.map(studio =>
						studio.uuid === action.payload.uuid ? action.payload : studio
					)
				}

				
				if (state.currentStudio?.uuid === action.payload.uuid) {
					state.currentStudio = action.payload
				}
			})
			.addCase(updateStudio.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})


export const { setCurrentStudio, handlePageChange, clearCurrentStudio } =
	studiosSlice.actions


export default studiosSlice.reducer
