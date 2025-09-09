import { LogOut, User } from 'lucide-react'
import { useUser } from '../../shared/hooks/useUser'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/shared/hooks/useAuth'

export const ProfileCard = ({ isCollapsed }) => {
	const { user, loading } = useUser()
	const { logout } = useAuth()

	return (
		<div className='p-4 border-t border-sidebar-border'>
			<div className='flex flex-wrap items-center gap-3'>
				<div className='w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center'>
					<User className='h-4 w-4 text-sidebar-accent-foreground' />
				</div>
				{!isCollapsed && (
					<div className='flex-1 min-w-0'>
						<p className='text-sm font-medium text-sidebar-foreground truncate'>
							{!loading ? `${user?.first_name} ${user?.last_name}` : 'user'}
						</p>
						<p className='text-xs text-muted-foreground truncate'>
							{!loading ? user?.email : 'email'}
						</p>
					</div>
				)}
				<Button
					variant='outline'
					size='sm'
					className='text-xs bg-transparent'
					onClick={() => logout()}
				>
					{!isCollapsed ? (
						'Log out'
					) : (
						<LogOut className='h-4 w-4 text-sidebar-accent-foreground text-white' />
					)}
				</Button>
			</div>
		</div>
	)
}
