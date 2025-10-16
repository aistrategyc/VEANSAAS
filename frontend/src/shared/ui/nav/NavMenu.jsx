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
	ScanHeart,
	TimerReset,
	LocationEditIcon,
} from 'lucide-react'

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
		path: '/dashboard-test',
		permission: ['page:view', 'view:dashboard'],
	},
	{
		id: 'appointments',
		text: 'Записи',
		icon: NotepadText,
		path: '/records',
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

	const isActive = path => {
		if (path === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(path)
	}

	const handleItemClick = itemId => {
		//
	}

	return (
		<nav className='flex-1 px-4 py-2 h-screen overflow-y-auto'>
			<ul className='space-y-1'>
				{menuItems.map(item => (
					<Item
						key={item.id}
						text={item.text}
						iconName={item.icon}
						isActive={isActive(item.path)}
						badge={item.badge}
						onClick={() => handleItemClick(item.id)}
						to={item.path}
						isCollapsed={isCollapsed}
						permission={item.permission}
					/>
				))}
			</ul>
		</nav>
	)
}
