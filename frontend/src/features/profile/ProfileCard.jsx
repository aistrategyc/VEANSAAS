import { User } from 'lucide-react'
import { useUser } from '../../shared/hooks/useUser'
import { useEffect } from 'react'

export const ProfileCard = ({ isCollapsed }) => {
	const { user, loading } = useUser()

	return (
		<div className='p-4 border-t border-sidebar-border'>
			<div className='flex items-center gap-3'>
				<div className='w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center'>
					<User className='h-4 w-4 text-sidebar-accent-foreground' />
				</div>
				{!isCollapsed && (
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-medium text-sidebar-foreground truncate'>
							{loading ? user.first_name : 'user '}
							{loading ? user.last : 'user'}
						</p>
						<p className='text-xs text-muted-foreground truncate'>
							{loading ? user.email : 'email'}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
