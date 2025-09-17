import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
import rolesReducer from '../../role/slice/rolesSlice'
import rolesCurrentReducer from '../../role/slice/rolesCurrentSlice'
const rootReducer = combineReducers({
	user: userReducer,
	roles: rolesReducer,
	rolesCurrent: rolesCurrentReducer,
})

export default rootReducer
