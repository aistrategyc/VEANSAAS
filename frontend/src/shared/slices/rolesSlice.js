import { createSlice } from '@reduxjs/toolkit'

// Удалите начальную инициализацию из JWT, так как данные будут приходить после логина
const rolesSlice = createSlice({
	name: 'roles',
	initialState: {
		roles: [],
		permissions: [],
		orgUuid: null,
		loading: false,
		error: null,
	},
	reducers: {
		setRoles: (state, action) => {
			state.roles = action.payload.roles
			state.permissions = action.payload.permissions
			state.orgUuid = action.payload.orgUuid
			state.error = null
		},

		setRolesLoading: (state, action) => {
			state.loading = action.payload
		},

		setRolesError: (state, action) => {
			state.error = action.payload
		},

		clearRoles: state => {
			state.roles = []
			state.permissions = []
			state.orgUuid = null
			state.error = null
		},
	},
})

export const { setRoles, setRolesLoading, setRolesError, clearRoles } =
	rolesSlice.actions

export default rolesSlice.reducer
