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
		path: '/calendar-test',
		permission: ['view:page', 'view:calendar'],
	},
	{
		id: 'dashboard',
		text: 'Dashboard',
		icon: LayoutDashboardIcon,
		path: '/dashboard-test',
		permission: ['view:page', 'view:dashboard'],
	},
	{
		id: 'appointments',
		text: 'Записи',
		icon: NotepadText,
		path: '/records',
		badge: '5',
		permission: ['view:page', 'view:appointments'],
	},
	{
		id: 'clients',
		text: 'Клиенты',
		icon: Users,
		path: '/clients-test',
		permission: ['view:page', 'view:clients'],
	},
	{
		id: 'staff',
		text: 'Сотрудники',
		icon: UserCheck,
		path: '/staff',
		permission: ['view:page', 'view:staff'],
	},
	{
		id: 'services',
		text: 'Услуги',
		icon: Scissors,
		path: '/services',
		permission: ['view:page', 'view:services'],
	},
	{
		id: 'studios',
		text: 'Студии',
		icon: Building2,
		path: '/studios',
		permission: ['view:page', 'view:studios'],
	},
	{
		id: 'inventory',
		text: 'Склад',
		icon: Package,
		path: '/inventory',
		permission: ['view:page', 'view:inventory'],
	},
	{
		id: 'schedule',
		text: 'Расписание',
		icon: TimerReset,
		path: '/schedule',
		permission: ['view:page', 'view:schedule'],
	},
	{
		id: 'loyalty',
		text: 'Лояльность',
		icon: Star,
		path: '/loyalty',
		permission: ['view:page', 'view:loyalty'],
	},
	{
		id: 'finances',
		text: 'Финансы',
		icon: DollarSign,
		path: '/finance',
		permission: ['view:page', 'view:finances'],
	},
	{
		id: 'compatibility',
		text: 'Матрица совместимости',
		icon: CompassIcon,
		path: '/compatibility',
		permission: ['view:page', 'view:compatibility'],
	},
	{
		id: 'locations',
		text: 'Локации',
		icon: LocationEditIcon,
		path: '/locations',
		permission: ['view:page', 'view:locations'],
	},
	{
		id: 'report',
		text: 'Отчеты',
		icon: Paperclip,
		path: '/report',
		permission: ['view:page', 'view:report'],
	},
	{
		id: 'analytics',
		text: 'Аналитика',
		icon: BarChart3,
		path: '/analytics',
		permission: ['view:page', 'view:analytics'],
	},
	{
		id: 'role',
		text: 'Роли',
		icon: UserCheck,
		path: '/role',
		role: 'admin',
		permission: ['view:page', 'view:role'],
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
		<nav className='flex-1 px-4 py-2'>
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
