import React from 'react'
import { Sidebar } from '../../features/sidebar/Sidebar'
import { Outlet } from 'react-router'

export const Layout = () => {
	return (
		<div className='flex min-h-screen bg-gray-50'>
			<Sidebar />
			<main className='flex-1 overflow-auto'>
				<Outlet />
			</main>
		</div>
	)
}
