import React from 'react'
import { Route, Routes } from 'react-router'
import { App } from '../../pages/App'
import { LoginPage } from '../../pages/Login/LoginPage'
import { RegisterPage } from '../../pages/singUp/RegisterPage'
import { HomePage } from '../../pages/home/HomePage'

export const RouterProvider = () => {
	return (
		<Routes>
			<Route exact path='/' element={<HomePage />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='/register' element={<RegisterPage />} />
		</Routes>
	)
}
