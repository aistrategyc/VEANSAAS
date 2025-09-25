import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api/api'

export const fetchStudios = createAsyncThunk(
	'studios/fetchStudios',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/studios')
			return response.data.items.map((studio, index) => ({
				...studio,
				id: index + 1,
				manager: 'Менеджер не указан',
				staff: studio.members_count || 0,
				rooms: 0,
				todayRevenue: '$0',
				monthRevenue: '$0',
				occupancy: 0,
				status: 'active',
				services: ['Услуги не указаны'],
				address: studio.address || 'Адрес не указан',
				phone: studio.phone_number || 'Телефон не указан',
			}))
		} catch (error) {
			return rejectWithValue(error.response?.data || 'Ошибка загрузки студий')
		}
	}
)

export const saveStudio = createAsyncThunk(
	'studios/saveStudio',
	async ({ studioData, editingStudio }, { rejectWithValue }) => {
		try {
			if (editingStudio) {
				// Отправляем запрос на обновление
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
		searchTerm: '',
		isLoading: false,
		isLoaded: false,
		error: null,
	},
	reducers: {
		setSearchTerm: (state, action) => {
			state.searchTerm = action.payload
			if (action.payload.trim() === '') {
				state.filteredItems = state.items
			} else {
				state.filteredItems = state.items.filter(studio =>
					studio.name.toLowerCase().includes(action.payload.toLowerCase())
				)
			}
		},
		clearError: state => {
			state.error = null
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
				state.items = action.payload
				state.filteredItems = action.payload
				state.isLoaded = true
			})
			.addCase(fetchStudios.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			.addCase(saveStudio.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(saveStudio.fulfilled, (state, action) => {
				state.isLoading = false

				if (action.payload.type === 'update') {
					// Находим индекс студии в основном массиве
					const index = state.items.findIndex(
						s => s.uuid === action.payload.studio.uuid
					)
					if (index !== -1) {
						// Сохраняем локальные поля (revenue, staff, etc.), которые не приходят с сервера
						const existingStudio = state.items[index]
						state.items[index] = {
							...existingStudio, // Сохраняем существующие данные
							...action.payload.studio, // Обновляем данными с сервера
							name: action.payload.studio.name, // Гарантируем обновление имени
						}

						// Обновляем в отфильтрованном списке
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
				} else if (action.payload.type === 'create') {
					// Создаем новую студию с дополнительными полями
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
				}
			})
			.addCase(saveStudio.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const { setSearchTerm, clearError } = studiosSlice.actions
export default studiosSlice.reducer
