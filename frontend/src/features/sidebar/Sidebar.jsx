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

			<NavMenu isCollapsed={isCollapsed} />
			<ProfileCard isCollapsed={isCollapsed} />
		</aside>
	)
}
