import { Link, useLocation } from 'react-router'
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
	Search,
	User,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'

const menuItems = [
	{ id: 'dashboard', text: 'Главная', icon: Home, path: '/' },
	{ id: 'calendar', text: 'Календарь', icon: Calendar, path: '/calendar' },
	{
		id: 'appointments',
		text: 'Записи',
		icon: Calendar,
		path: '/records',
		badge: '5',
	},
	{ id: 'clients', text: 'Клиенты', icon: Users, path: '/clients' },
	{ id: 'staff', text: 'Сотрудники', icon: UserCheck, path: '/staff' },
	{ id: 'services', text: 'Услуги', icon: Scissors, path: '/services' },
	{ id: 'studios', text: 'Студии', icon: Building2, path: '/studios' },
	{ id: 'inventory', text: 'Склад', icon: Package, path: '/inventory' },
	{ id: 'loyalty', text: 'Лояльность', icon: Star, path: '/loyalty' },
	{ id: 'finances', text: 'Финансы', icon: DollarSign, path: '/finance' },
	{ id: 'analytics', text: 'Аналитика', icon: BarChart3, path: '/analytics' },
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
					/>
				))}
			</ul>
		</nav>
	)
}
