import { Link } from 'react-router'

export const NavItem = ({
	isActive = false,
	onClick,
	text,
	badge = null,
	icon = null,
	to,
}) => {
	return (
		<li>
			<Link
				to={to}
				className={`
        relative flex items-center px-4 py-3 text-sm font-medium transition-all duration-200
        ${
					isActive
						? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
				}
        cursor-pointer group
      `}
				onClick={onClick}
			>
				{icon && (
					<span className='mr-3 text-lg opacity-70 group-hover:opacity-100'>
						{icon}
					</span>
				)}

				<span className='flex-1 truncate'>{text}</span>

				{badge && (
					<span
						className={`
          ml-2 px-2 py-1 text-xs font-semibold rounded-full
          ${
						isActive
							? 'bg-blue-100 text-blue-700'
							: 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
					}
        `}
					>
						{badge}
					</span>
				)}

				{!isActive && (
					<div className='absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-blue-200 transition-colors duration-200' />
				)}
			</Link>
		</li>
	)
}
