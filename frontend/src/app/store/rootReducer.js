import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
import rolesReducer from '../../role/slice/rolesSlice'
const rootReducer = combineReducers({
	user: userReducer,
	roles: rolesReducer,
})

export default rootReducer
