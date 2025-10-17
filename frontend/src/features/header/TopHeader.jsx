import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/shared/ui/theme/ToggleTheme'
import { Bell, Plus, Settings, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import NotificationDropdown from '../notification/NotificationDropdown'
import ChangeStudio from './ChangeStudio'

export const TopHeader = () => {
	const user = {
		id: '1',
		email: 'admin@salon.com',
		name: 'Анна Администратор',
		role: 'master',
		organizationId: 'org1',
		isActive: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	}
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
				<ChangeStudio />
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
				<ThemeToggle />
				<NotificationDropdown />
				<div className='w-8 h-8 bg-primary rounded-full'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
								<div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
									<span className='text-xs font-medium text-primary-foreground'>
										{user?.name
											.split(' ')
											.map(n => n[0])
											.join('')}
									</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56' align='end' forceMount>
							<DropdownMenuLabel className='font-normal'>
								<div className='flex flex-col space-y-1'>
									<p className='text-sm font-medium leading-none'>
										{user?.name}
									</p>
									<p className='text-xs leading-none text-muted-foreground'>
										{user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => router.push('/dashboard/profile')}
							>
								<User className='mr-2 h-4 w-4' />
								<span>Профиль</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => router.push('/dashboard/settings')}
							>
								<Settings className='mr-2 h-4 w-4' />
								<span>Настройки</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<span>Выйти</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Мобильное меню - иконка пользователя */}
			<div className='md:hidden flex items-center'>
				<ThemeToggle />
				<Button variant='ghost' size='sm' className='relative mr-2'>
					<Bell className='h-5 w-5' />
					<Badge className='absolute -top-1 -right-1 h-5 w-5 pl-1 text-xs bg-destructive'>
						3
					</Badge>
				</Button>

				<div className='w-8 h-8 bg-primary rounded-full'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
								<div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
									<span className='text-xs font-medium text-primary-foreground'>
										{user?.name
											.split(' ')
											.map(n => n[0])
											.join('')}
									</span>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56' align='end' forceMount>
							<DropdownMenuLabel className='font-normal'>
								<div className='flex flex-col space-y-1'>
									<p className='text-sm font-medium leading-none'>
										{user?.name}
									</p>
									<p className='text-xs leading-none text-muted-foreground'>
										{user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => router.push('/dashboard/profile')}
							>
								<User className='mr-2 h-4 w-4' />
								<span>Профиль</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => router.push('/dashboard/settings')}
							>
								<Settings className='mr-2 h-4 w-4' />
								<span>Настройки</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<span>Выйти</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
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
					</div>
				</div>
			)}
		</header>
	)
}
