import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/shared/api/client'

export const fetchCategories = createAsyncThunk(
	'categories/fetchCategories',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get('/services/categories')
			return response.data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка загрузки категорий'
			)
		}
	}
)

export const createCategory = createAsyncThunk(
	'categories/createCategory',
	async (categoryData, { rejectWithValue }) => {
		try {
			const response = await api.post('/services/categories', categoryData)
			return response.data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка создания категории'
			)
		}
	}
)

export const createAttribute = createAsyncThunk(
	'categories/createAttribute',
	async (data, { rejectWithValue }) => {
		try {
			const response = await api.post('/services/attributes', data)
			return response.data
		} catch (error) {
			return rejectWithValue(error.response?.data)
		}
	}
)

export const updateCategory = createAsyncThunk(
	'categories/updateCategory',
	async ({ uuid, categoryData }, { rejectWithValue }) => {
		try {
			const response = await api.patch(
				`/services/categories/${uuid}`,
				categoryData
			)
			return response.data
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка обновления категории'
			)
		}
	}
)

export const deleteCategory = createAsyncThunk(
	'categories/deleteCategory',
	async (uuid, { rejectWithValue }) => {
		try {
			await api.delete(`/services/categories/${uuid}`)
			return uuid
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка удаления категории'
			)
		}
	}
)

export const deleteAttribute = createAsyncThunk(
	'categories/deleteAttribute',
	async ({categoryUuid, uuid}, { rejectWithValue }) => {
		try {
			await api.delete(`/services/attributes/${uuid}`)
			return { uuid, categoryUuid }
		} catch (error) {
			return rejectWithValue(
				error.response?.data || 'Ошибка удаления категории'
			)
		}
	}
)

const categoriesSlice = createSlice({
	name: 'categories',
	initialState: {
		items: [],
		pagination: {
			count: 0,
			offset: 0,
			limit: 10,
			has_more: false,
		},
		isLoading: false,
		error: null,
	},
	extraReducers: builder => {
		builder

			.addCase(fetchCategories.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.isLoading = false
				state.isLoaded = true

				const { items, pagination } = action.payload
				state.items = items
				state.pagination = pagination
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(createCategory.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.isLoading = false
				state.items.push(action.payload.items)
				state.pagination = {
					...state.pagination,
				}
			})
			.addCase(createCategory.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(createAttribute.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createAttribute.fulfilled, (state, action) => {
				state.isLoading = false

				const categoryUuid = action.payload.category_uuid
				const categoryIndex = state.items.findIndex(
					item => item.uuid === categoryUuid
				)
				state.items[categoryIndex].attributes.push(action.payload)
			})
			.addCase(createAttribute.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(updateCategory.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.isLoading = false
				const index = state.items.findIndex(
					item => item.uuid === action.payload.uuid
				)
				if (index !== -1) {
					state.items[index] = action.payload
				}
			})
			.addCase(updateCategory.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(deleteCategory.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = state.items.filter(item => item.uuid !== action.payload)
				state.pagination = {
					...state.pagination,
				}
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

			.addCase(deleteAttribute.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(deleteAttribute.fulfilled, (state, action) => {
				state.isLoading = false
				const categoryIndex = state.items.findIndex(
					item => item.uuid === action.payload.categoryUuid
				)
				state.items[categoryIndex].attributes =
					state.items[categoryIndex].attributes.filter(item => item.uuid !== action.payload.uuid)

			})
			.addCase(deleteAttribute.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const {} = categoriesSlice.actions
export default categoriesSlice.reducer
