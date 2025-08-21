import React from 'react'
import { Route, Routes } from 'react-router'
import { App } from '../../pages/App'
import { Auth } from '../../pages/Auth'

export const RouterProvider = () => {
	return (
		<Routes>
			<Route path='/' element={<App />} />
			<Route path='/auth' element={<Auth />} />
		</Routes>
	)
}
