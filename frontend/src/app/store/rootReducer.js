import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
import studiosReducer from '../../shared/slices/studiosSlice'
import servicesReducer from '../../shared/slices/servicesSlice'
import categoriesReducer from '../../shared/slices/categoriesSlice'
import rolesReducer from '../../role/slice/rolesSlice'

const rootReducer = combineReducers({
	user: userReducer,
	roles: rolesReducer,
	studios: studiosReducer,
	services: servicesReducer,
	categories: categoriesReducer,
})

export default rootReducer
