import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Plus, Settings } from 'lucide-react'

export const TopHeader = () => {
	return (
		<header className='flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm'>
			<div className='flex items-center gap-4'>
				<h1 className='text-2xl font-bold text-foreground'>
					DAO1 Activity Dashboard
				</h1>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						className='text-xs bg-transparent'
					>
						View 1
					</Button>
					<Button variant='ghost' size='sm'>
						<Settings className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<div className='flex items-center gap-4'>
				<div className='flex items-center gap-2'>
					<div className='flex -space-x-2'>
						<div className='w-8 h-8 bg-primary rounded-full border-2 border-background'></div>
						<div className='w-8 h-8 bg-secondary rounded-full border-2 border-background'></div>
						<div className='w-8 h-8 bg-accent rounded-full border-2 border-background'></div>
					</div>
				</div>

				<Button variant='ghost' size='sm' className='relative'>
					<Bell className='h-5 w-5' />
					<Badge className='absolute -top-1 -right-1 h-5 w-5 pl-1 text-xs bg-destructive'>
						3
					</Badge>
				</Button>

				<Button variant='ghost' size='sm'>
					<Settings className='h-5 w-5' />
				</Button>

				<Button size='sm' className='bg-primary hover:bg-primary/90'>
					<Plus className='h-4 w-4 mr-2' />
					Add Widget
				</Button>

				<div className='w-8 h-8 bg-primary rounded-full'></div>
			</div>
		</header>
	)
}
