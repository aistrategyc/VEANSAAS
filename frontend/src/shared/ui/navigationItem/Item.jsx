import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { PermissionGuard } from '@/role/PermissionGuard'
export const Item = ({
	isActive = false,
	onClick,
	text,
	badge = null,
	to,
	iconName: Icon = null,
	isCollapsed,
	permission,
}) => {
	return (
		<PermissionGuard requiredAny={permission} scope='org'>
			<li>
				<Link
					to={to}
					className={cn(
						'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
						isActive
							? 'bg-sidebar-primary text-sidebar-primary-foreground'
							: 'text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent'
					)}
					onClick={onClick}
				>
					<Icon className='h-5 w-5 flex-shrink-0' />
					{!isCollapsed && <span>{text}</span>}
				</Link>
			</li>
		</PermissionGuard>
	)
}
