import React from 'react'
import { Sidebar } from '../../features/sidebar/Sidebar'
import { Outlet } from 'react-router'
import { TopHeader } from '@/features/header/TopHeader'

export const Layout = () => {
	return (
		<div className='flex h-screen bg-background'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<TopHeader />
				<main className='flex-1 overflow-y-auto p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
