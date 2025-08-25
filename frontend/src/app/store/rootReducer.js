import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from '../../shared/redux/slices/counterSlice'
import authReducer from '../../shared/redux/slices/authSlice'

const rootReducer = combineReducers({
	counter: counterReducer,
	auth: authReducer,
})

export default rootReducer
