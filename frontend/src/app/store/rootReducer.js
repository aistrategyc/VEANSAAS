import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
import studiosReducer from '../../shared/slices/studiosSlice'
import rolesReducer from '../../role/slice/rolesSlice'
import rolesCurrentReducer from '../../role/slice/rolesCurrentSlice'
const rootReducer = combineReducers({
	user: userReducer,
	roles: rolesReducer,
	rolesCurrent: rolesCurrentReducer,
	studios: studiosReducer,
})

export default rootReducer
