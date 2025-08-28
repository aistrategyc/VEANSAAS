import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../../shared/slices/userSlice'
const rootReducer = combineReducers({
	user: userReducer,
})

export default rootReducer
