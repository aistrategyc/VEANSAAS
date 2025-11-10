import { useLocation } from 'react-router'
import { Item } from '../navigationItem/Item'
import {
	Home,
	Calendar,
	Users,
	UserCheck,
	Scissors,
	Building2,
	Package,
	Star,
	DollarSign,
	BarChart3,
	LayoutDashboardIcon,
	NotepadText,
	CompassIcon,
	Paperclip,
	TimerReset,
	LocationEditIcon,
	Search,
} from 'lucide-react'
import { PermissionGuard } from '@/widgets/permissions/PermissionGuard'
import { useMemo, useState } from 'react'

const menuItems = [
	{
		id: 'home',
		text: 'Главная',
		icon: Home,
		path: '/',
	},
	{
		id: 'calendar',
		text: 'Календарь',
		icon: Calendar,
		path: '/calendar',
		permission: ['page:view', 'view:calendar'],
	},
	{
		id: 'dashboard',
		text: 'Dashboard',
		icon: LayoutDashboardIcon,
		path: '/dashboard',
		permission: ['page:view', 'view:dashboard'],
	},
	{
		id: 'appointments',
		text: 'Записи',
		icon: NotepadText,
		path: '/appointments',
		badge: '5',
		permission: ['page:view', 'view:appointments'],
	},
	{
		id: 'clients',
		text: 'Клиенты',
		icon: Users,
		path: '/clients',
		permission: ['page:view', 'view:clients'],
	},
	{
		id: 'staff',
		text: 'Сотрудники',
		icon: UserCheck,
		path: '/staff',
		permission: ['page:view', 'view:staff'],
	},
	{
		id: 'services',
		text: 'Услуги',
		icon: Scissors,
		path: '/services',
		permission: ['page:view', 'view:services'],
	},
	{
		id: 'studios',
		text: 'Студии',
		icon: Building2,
		path: '/studios',
		permission: ['page:view', 'view:studios'],
	},
	{
		id: 'inventory',
		text: 'Склад',
		icon: Package,
		path: '/inventory',
		permission: ['page:view', 'view:inventory'],
	},
	{
		id: 'schedule',
		text: 'Расписание',
		icon: TimerReset,
		path: '/schedule',
		permission: ['page:view', 'view:schedule'],
	},
	{
		id: 'loyalty',
		text: 'Лояльность',
		icon: Star,
		path: '/loyalty',
		permission: ['page:view', 'view:loyalty'],
	},
	{
		id: 'finances',
		text: 'Финансы',
		icon: DollarSign,
		path: '/finance',
		permission: ['page:view', 'view:finances'],
	},
	{
		id: 'compatibility',
		text: 'Матрица совместимости',
		icon: CompassIcon,
		path: '/compatibility',
		permission: ['page:view', 'view:compatibility'],
	},
	{
		id: 'locations',
		text: 'Локации',
		icon: LocationEditIcon,
		path: '/locations',
		permission: ['page:view', 'view:locations'],
	},
	{
		id: 'report',
		text: 'Отчеты',
		icon: Paperclip,
		path: '/report',
		permission: ['page:view', 'view:report'],
	},
	{
		id: 'analytics',
		text: 'Аналитика',
		icon: BarChart3,
		path: '/analytics',
		permission: ['page:view', 'analytics.view'],
	},
	{
		id: 'role',
		text: 'Роли',
		icon: UserCheck,
		path: '/role',
		role: 'admin',
		permission: ['page:view', 'view:role'],
	},
]

export const NavMenu = ({ isCollapsed }) => {
	const location = useLocation()
	const [searchTerm, setSearchTerm] = useState('')

	const filteredMenuItems = useMemo(() => {
		if (!searchTerm.trim()) return menuItems

		return menuItems.filter(item =>
			item.text.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [searchTerm])

	const isActive = path => {
		if (path === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(path)
	}

	const handleItemClick = itemId => {
		// логика клика
	}

	return (
		<nav className='flex-1 px-4 py-2 h-screen overflow-y-auto'>
			<div className='mb-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<input
						type='text'
						placeholder='Поиск в меню...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
					/>
				</div>
			</div>

			{/* Результаты поиска */}
			<ul className='space-y-1'>
				{filteredMenuItems.length > 0 ? (
					filteredMenuItems.map(item => (
						<PermissionGuard
							key={item.id}
							requiredAny={item.permission}
							scope='orgs'
						>
							<Item
								text={item.text}
								iconName={item.icon}
								isActive={isActive(item.path)}
								badge={item.badge}
								onClick={() => handleItemClick(item.id)}
								to={item.path}
								isCollapsed={isCollapsed}
								permission={item.permission}
							/>
						</PermissionGuard>
					))
				) : (
					<div className='text-center text-muted-foreground py-4'>
						Ничего не найдено
					</div>
				)}
			</ul>
		</nav>
	)
}
