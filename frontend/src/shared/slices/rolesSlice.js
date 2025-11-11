import { createSlice } from '@reduxjs/toolkit'

// Удалите начальную инициализацию из JWT, так как данные будут приходить после логина
const rolesSlice = createSlice({
	name: 'roles',
	initialState: {
		roles: [],
		permissions: [],
		orgUuid: '08c1d435-b434-4b79-b9dd-6b9c61657a37',
		loading: false,
		error: null,
	},
	reducers: {
		setRoles: (state, action) => {
			state.roles = action.payload.roles

			state.error = null
		},
		setPermissions: (state, action) => {
			state.permissions = action.payload.permissions
			state.orgUuid = '08c1d435-b434-4b79-b9dd-6b9c61657a37'
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

export const {
	setRoles,
	setRolesLoading,
	setPermissions,
	setRolesError,
	clearRoles,
} = rolesSlice.actions

export default rolesSlice.reducer
