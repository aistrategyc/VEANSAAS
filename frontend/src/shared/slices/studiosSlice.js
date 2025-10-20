import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/shared/api/client'

export const fetchStudios = createAsyncThunk(
	'studios/fetchStudios',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/studios')
			return response.data
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

export const saveStudio = createAsyncThunk(
	'studios/saveStudio',
	async ({ studioData, editingStudio }, { rejectWithValue }) => {
		try {
			if (editingStudio) {
				const response = await api.patch(
					`/studios/${editingStudio.uuid}`,
					{ name: studioData.name },
					{
						headers: {
							'X-Studio-UUID': editingStudio.uuid,
						},
					}
				)
				return {
					type: 'update',
					studio: { ...response.data, uuid: editingStudio.uuid },
				}
			} else {
				const response = await api.post('/studios', studioData)
				return {
					type: 'create',
					studio: response.data,
				}
			}
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка сохранения студии')
		}
	}
)

const studiosSlice = createSlice({
	name: 'studios',
	initialState: {
		items: [],
		filteredItems: [],
		studiosSelection: [],
		currentStudio: null,
		searchTerm: '',
		isLoading: false,
		isSelectionLoading: false,
		isLoaded: false,
		error: null,
	},
	reducers: {
		clearError: state => {
			state.error = null
		},
		clearCurrentStudio: state => {
			state.currentStudio = null
			localStorage.removeItem('currentStudioUuid')
		},
		setCurrentStudio: (state, action) => {
			const studioUuid = action.payload
			const studios = state.studiosSelection
			const studio = studios.find(s => s.uuid === studioUuid) || studios[0]

			if (studio) {
				state.currentStudio = studio
				localStorage.setItem('currentStudioUuid', studio.uuid)
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchStudiosSelection.pending, state => {
				state.isSelectionLoading = true
				state.error = null
			})
			.addCase(fetchStudiosSelection.fulfilled, (state, action) => {
				state.isSelectionLoading = false
				state.studiosSelection = action.payload

				if (!state.currentStudio && action.payload.length > 0) {
					const savedStudioUuid = localStorage.getItem('currentStudioUuid')
					const studioToSet = savedStudioUuid
						? action.payload.find(studio => studio.uuid === savedStudioUuid)
						: action.payload[0]

					if (studioToSet) {
						state.currentStudio = studioToSet
						localStorage.setItem('currentStudioUuid', studioToSet.uuid)
					}
				}
			})
			.addCase(fetchStudiosSelection.rejected, (state, action) => {
				state.isSelectionLoading = false
				state.error = action.payload
			})
			.addCase(saveStudio.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(saveStudio.fulfilled, (state, action) => {
				state.isLoading = false

				if (action.payload.type === 'update') {
					const index = state.items.findIndex(
						s => s.uuid === action.payload.studio.uuid
					)
					if (index !== -1) {
						const existingStudio = state.items[index]
						state.items[index] = {
							...existingStudio,
							...action.payload.studio,
							name: action.payload.studio.name,
						}

						const filteredIndex = state.filteredItems.findIndex(
							s => s.uuid === action.payload.studio.uuid
						)
						if (filteredIndex !== -1) {
							state.filteredItems[filteredIndex] = {
								...state.filteredItems[filteredIndex],
								...action.payload.studio,
								name: action.payload.studio.name,
							}
						}
					}

					// Обновляем в списке выбора если нужно
					const selectionIndex = state.studiosSelection.findIndex(
						s => s.uuid === action.payload.studio.uuid
					)
					if (selectionIndex !== -1) {
						state.studiosSelection[selectionIndex] = {
							...state.studiosSelection[selectionIndex],
							name: action.payload.studio.name,
						}
					}

					// Обновляем текущую студию если она была изменена
					if (state.currentStudio?.uuid === action.payload.studio.uuid) {
						state.currentStudio = {
							...state.currentStudio,
							name: action.payload.studio.name,
						}
					}
				} else if (action.payload.type === 'create') {
					const newStudio = {
						...action.payload.studio,
						id: state.items.length + 1,
						manager: 'Менеджер не указан',
						staff: 0,
						rooms: 0,
						todayRevenue: '$0',
						monthRevenue: '$0',
						occupancy: 0,
						status: 'active',
						services: ['Услуги не указаны'],
						address: action.payload.studio.address || 'Адрес не указан',
						phone: action.payload.studio.phone_number || 'Телефон не указан',
					}

					state.items.push(newStudio)
					state.filteredItems.push(newStudio)

					// Добавляем в список выбора
					state.studiosSelection.push({
						uuid: newStudio.uuid,
						name: newStudio.name,
					})
				}
			})
			.addCase(saveStudio.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			.addCase(fetchStudios.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchStudios.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = action.payload
			})
			.addCase(fetchStudios.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const { setCurrentStudio, clearError, clearCurrentStudio } =
	studiosSlice.actions
export default studiosSlice.reducer

export const selectStudiosSelection = state =>
	state.rootReducer.studios.studiosSelection
export const selectCurrentStudio = state =>
	state.rootReducer.studios.currentStudio
export const selectIsSelectionLoading = state =>
	state.rootReducer.studios.isSelectionLoading
