import { NavMenu } from '../../shared/ui/nav/NavMenu'

export const Sidebar = () => {
	return (
		<aside className='w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen'>
			{/* Заголовок пользователя */}
			<div className='p-6 border-b border-gray-100'>
				<h2 className='text-xl font-bold text-gray-800'>Алексей Козлов</h2>
				<p className='text-sm text-gray-500 mt-1'>Тату мастер</p>
			</div>
			<NavMenu />
		</aside>
	)
}
