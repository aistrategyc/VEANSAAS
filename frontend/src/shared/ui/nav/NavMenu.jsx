import { useLocation } from 'react-router'
import { NavItem } from '../navigationItem/NavItem'

const menuItems = [
	{
		id: 'records',
		text: 'Записи',
		icon: '📅',
		path: '/records',
		badge: '5',
	},
	{ id: 'clients', text: 'Клиенты', icon: '👥', path: '/clients' },
	{ id: 'services', text: 'Услуги', icon: '🔧', path: '/services' },
	{ id: 'gallery', text: 'Галерея', icon: '🖼️', path: '/gallery' },
	{ id: 'mailing', text: 'Рассылки', icon: '✉️', path: '/mailing' },
	{
		id: 'certificates',
		text: 'Сертификаты',
		icon: '🏆',
		path: '/certificates',
	},
	{
		id: 'promotions',
		text: 'Акции',
		icon: '🎯',
		path: '/promotions',
		badge: 'New',
	},
	{ id: 'education', text: 'Обучение', icon: '🎓', path: '/education' },
	{ id: 'loyalty', text: 'Лояльность', icon: '💎', path: '/loyalty' },
	{ id: 'finance', text: 'Финансы', icon: '💰', path: '/finance' },
	{ id: 'shop', text: 'Магазин', icon: '🛒', path: '/shop' },
]

export const NavMenu = () => {
	const location = useLocation()

	const isActive = path => {
		if (path === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(path)
	}

	const handleItemClick = itemId => {
		console.log(`Clicked on item: ${itemId}`)
	}

	return (
		<nav className='p-4'>
			<ul className='space-y-1'>
				{menuItems.map(item => (
					<NavItem
						key={item.id}
						text={item.text}
						icon={item.icon}
						isActive={isActive(item.path)}
						badge={item.badge}
						onClick={() => handleItemClick(item.id)}
						to={item.path}
					/>
				))}
			</ul>
		</nav>
	)
}
