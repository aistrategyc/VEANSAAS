import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from '../../shared/redux/slices/counterSlice'
import userReducer from '../../shared/redux/slices/userSlice'

const rootReducer = combineReducers({
	counter: counterReducer,
	user: userReducer,
})

export default rootReducer
