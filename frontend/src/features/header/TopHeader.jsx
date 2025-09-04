import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/shared/hooks/useUser'
import { Bell, Plus, Settings, Menu, User, X } from 'lucide-react'
import { useState } from 'react'

export const TopHeader = () => {
	const { fetchUser } = useUser()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='flex flex-wrap items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm'>
			{/* Логотип и основные кнопки */}
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className='md:hidden'
				>
					{isMenuOpen ? (
						<X className='h-5 w-5' />
					) : (
						<Menu className='h-5 w-5' />
					)}
				</Button>

				<h1 className='text-xl font-bold text-foreground md:text-2xl'>DAO1</h1>

				<div className='hidden md:flex items-center gap-2 ml-4'>
					<Button
						variant='outline'
						size='sm'
						className='text-xs bg-transparent'
					>
						View 1
					</Button>
					<Button onClick={() => fetchUser()} variant='ghost' size='sm'>
						<Settings className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Десктопное меню */}
			<div className='hidden md:flex items-center gap-4'>
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

			{/* Мобильное меню - иконка пользователя */}
			<div className='md:hidden flex items-center'>
				<Button variant='ghost' size='sm' className='relative mr-2'>
					<Bell className='h-5 w-5' />
					<Badge className='absolute -top-1 -right-1 h-5 w-5 pl-1 text-xs bg-destructive'>
						3
					</Badge>
				</Button>

				<div className='w-8 h-8 bg-primary rounded-full'></div>
			</div>

			{/* Мобильное выпадающее меню */}
			{isMenuOpen && (
				<div className='md:hidden w-full mt-4 bg-card border border-border rounded-lg p-4'>
					<div className='flex flex-col space-y-3'>
						<div className='flex items-center gap-2 pb-3 border-b border-border'>
							<div className='flex -space-x-2 mr-2'>
								<div className='w-8 h-8 bg-primary rounded-full border-2 border-background'></div>
								<div className='w-8 h-8 bg-secondary rounded-full border-2 border-background'></div>
								<div className='w-8 h-8 bg-accent rounded-full border-2 border-background'></div>
							</div>
							<span className='text-sm'>Team Members</span>
						</div>

						<Button
							variant='outline'
							size='sm'
							className='justify-start bg-transparent'
						>
							<Settings className='h-4 w-4 mr-2' />
							View 1
						</Button>

						<Button variant='ghost' size='sm' className='justify-start'>
							<Settings className='h-4 w-4 mr-2' />
							Settings
						</Button>

						<Button
							size='sm'
							className='justify-start bg-primary hover:bg-primary/90'
						>
							<Plus className='h-4 w-4 mr-2' />
							Add Widget
						</Button>
					</div>
				</div>
			)}
		</header>
	)
}
