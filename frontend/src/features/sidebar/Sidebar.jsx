import { NavMenu } from '../../shared/ui/nav/NavMenu'
import { ProfileCard } from '../profile/ProfileCard'

export const Sidebar = () => {
	return (
		<aside className='w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen'>
			<ProfileCard />
			<NavMenu />
		</aside>
	)
}
