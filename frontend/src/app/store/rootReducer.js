import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
import studiosReducer from '../../shared/slices/studiosSlice'
import servicesReducer from '../../shared/slices/servicesSlice'
import categoriesReducer from '../../shared/slices/categoriesSlice'
import rolesReducer from '../../role/slice/rolesSlice'
import rolesCurrentReducer from '../../role/slice/rolesCurrentSlice'

const rootReducer = combineReducers({
	user: userReducer,
	roles: rolesReducer,
	rolesCurrent: rolesCurrentReducer,
	studios: studiosReducer,
	services: servicesReducer,
	categories: categoriesReducer,
})

export default rootReducer
