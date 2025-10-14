import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/shared/api/client'

// Асинхронные действия для категорий
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

const categoriesSlice = createSlice({
	name: 'categories',
	initialState: {
		items: [],
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
			// Fetch Categories
			.addCase(fetchCategories.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = action.payload
				state.isLoaded = true
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			// Create Category
			.addCase(createCategory.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(createCategory.fulfilled, (state, action) => {
				state.isLoading = false
				state.items.push(action.payload)
			})
			.addCase(createCategory.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
			// Update Category
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
			// Delete Category
			.addCase(deleteCategory.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				state.isLoading = false
				state.items = state.items.filter(item => item.uuid !== action.payload)
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})
	},
})

export const { clearError } = categoriesSlice.actions
export default categoriesSlice.reducer
