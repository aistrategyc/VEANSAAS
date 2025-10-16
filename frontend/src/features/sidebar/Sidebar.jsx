import { Search, User } from 'lucide-react'
import { NavMenu } from '../../shared/ui/nav/NavMenu'
import { ProfileCard } from '../profile/ProfileCard'
import { LogoOrganization } from '../logoOrganization/LogoOrganization'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)

	const updateIsCollapsed = newState => {
		setIsCollapsed(newState)
	}
	return (
		<aside
			className={cn(
				'sidebar-nav flex flex-col h-screen transition-all duration-300',
				isCollapsed ? 'w-19' : 'w-64'
			)}
		>
			<LogoOrganization isCollapsed={isCollapsed} onClick={updateIsCollapsed} />

			<div className='p-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					{!isCollapsed && (
						<input
							type='text'
							placeholder='Поиск...'
							className='w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
						/>
					)}
				</div>
			</div>

			<NavMenu isCollapsed={isCollapsed} />
			<ProfileCard isCollapsed={isCollapsed} />
		</aside>
	)
}
