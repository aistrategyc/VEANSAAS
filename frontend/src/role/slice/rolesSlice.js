import { parseJwt } from '@/shared/helper/jwt-helpers'
import { getCookie } from '@/shared/helper/cookie-utils'
import { createSlice } from '@reduxjs/toolkit'

// Удалите начальную инициализацию из JWT, так как данные будут приходить после логина
const rolesSlice = createSlice({
	name: 'roles',
	initialState: {
		roles: [],
		permissions: [],
		org_uuid: null,
		loading: false,
		error: null,
	},
	reducers: {
		setRoles: (state, action) => {
			state.roles = action.payload.roles
			state.permissions = action.payload.permissions
			state.org_uuid = action.payload.org_uuid
			state.error = null
		},

		setRolesLoading: (state, action) => {
			state.loading = action.payload
		},

		setRolesError: (state, action) => {
			state.error = action.payload
		},

		// Добавьте экшен для очистки данных при логауте
		clearRoles: state => {
			state.roles = []
			state.permissions = []
			state.org_uuid = null
			state.error = null
		},
	},
})

export const { setRoles, setRolesLoading, setRolesError, clearRoles } =
	rolesSlice.actions

export default rolesSlice.reducer
