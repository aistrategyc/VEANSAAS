// store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialRoleId = localStorage.getItem('userRoleId') || null

const rolesCurrentSlice = createSlice({
	name: 'rolesCurrent',
	initialState: {
		roleId: initialRoleId,
	},
	reducers: {
		setCurrentRole: (state, action) => {
			state.roleId = action.payload
			localStorage.setItem('userRoleId', action.payload)
		},
		clearCurrentRole: state => {
			state.roleId = null
			localStorage.removeItem('userRoleId')
		},
	},
})

export const { setCurrentRole, clearCurrentRole } = rolesCurrentSlice.actions
export default rolesCurrentSlice.reducer
