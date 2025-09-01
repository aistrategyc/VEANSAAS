import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Scissors } from 'lucide-react'

export const LogoOrganization = ({ isCollapsed, onClick }) => {
	return (
		<div className='flex items-center justify-between flex-wrap p-6 border-b border-sidebar-border'>
			<div className='flex items-center gap-3'>
				<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
					<Scissors className='h-4 w-4 text-primary-foreground' />
				</div>

				{!isCollapsed && (
					<span className='font-bold text-lg text-sidebar-foreground'>
						BeautyCRM
					</span>
				)}
			</div>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => {
					onClick(!isCollapsed)
				}}
				className='text-sidebar-foreground hover:bg-sidebar-accent/10'
			>
				{isCollapsed ? (
					<ChevronRight className='h-4 w-4' />
				) : (
					<ChevronLeft className='h-4 w-4' />
				)}
			</Button>
		</div>
	)
}
