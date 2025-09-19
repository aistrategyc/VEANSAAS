'use client'

import React, { useState } from 'react'
import {
	Bell,
	CheckCircle,
	Clock,
	AlertCircle,
	Check,
	Settings,
	User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const NotificationDropdown = () => {
	const [notifications, setNotifications] = useState([
		{
			id: 1,
			title: 'Новое сообщение',
			description: 'У вас новое сообщение от пользователя',
			time: '2 минуты назад',
			read: false,
			type: 'message',
		},
		{
			id: 2,
			title: 'Обновление системы',
			description: 'Доступно новое обновление приложения',
			time: '1 час назад',
			read: false,
			type: 'system',
		},
		{
			id: 3,
			title: 'Напоминание',
			description: 'Не забудьте завершить задачу до конца дня',
			time: '3 часа назад',
			read: true,
			type: 'reminder',
		},
		{
			id: 4,
			title: 'Ошибка входа',
			description: 'Не удалось войти в систему. Проверьте данные',
			time: '5 часов назад',
			read: true,
			type: 'error',
		},
	])

	const unreadCount = notifications.filter(n => !n.read).length

	const markAsRead = id => {
		setNotifications(
			notifications.map(notification =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		)
	}

	const markAllAsRead = () => {
		setNotifications(
			notifications.map(notification => ({
				...notification,
				read: true,
			}))
		)
	}

	const clearAll = () => {
		setNotifications([])
	}

	const getNotificationIcon = type => {
		switch (type) {
			case 'message':
				return <Bell className='h-4 w-4 text-blue-500' />
			case 'system':
				return <CheckCircle className='h-4 w-4 text-green-500' />
			case 'reminder':
				return <Clock className='h-4 w-4 text-yellow-500' />
			case 'error':
				return <AlertCircle className='h-4 w-4 text-red-500' />
			default:
				return <Bell className='h-4 w-4 text-gray-500' />
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-9 w-9 rounded-full p-0'>
					<Bell className='h-5 w-5' />
					{unreadCount > 0 && (
						<Badge
							variant='destructive'
							className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs'
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-80 rounded-lg' align='end' forceMount>
				<DropdownMenuLabel className='font-normal p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>Уведомления</p>
							<p className='text-xs leading-none text-muted-foreground'>
								{unreadCount > 0
									? `${unreadCount} непрочитанных`
									: 'Все прочитаны'}
							</p>
						</div>
						<div className='flex space-x-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={markAllAsRead}
								disabled={unreadCount === 0}
								className='h-8 text-xs text-blue-600 hover:text-blue-800'
							>
								Прочитать все
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={clearAll}
								disabled={notifications.length === 0}
								className='h-8 text-xs text-red-600 hover:text-red-800'
							>
								Очистить
							</Button>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<ScrollArea className='h-80'>
					<DropdownMenuGroup>
						{notifications.length === 0 ? (
							<div className='flex flex-col items-center justify-center p-6 text-center'>
								<Bell className='h-10 w-10 text-muted-foreground/50 mb-2' />
								<p className='text-sm text-muted-foreground'>Нет уведомлений</p>
								<p className='text-xs text-muted-foreground/70 mt-1'>
									Здесь будут появляться ваши уведомления
								</p>
							</div>
						) : (
							notifications.map(notification => (
								<DropdownMenuItem
									key={notification.id}
									className={cn(
										'p-3 cursor-pointer border-b border-border/50 last:border-b-0',
										!notification.read && 'bg-muted/50'
									)}
									onSelect={() => markAsRead(notification.id)}
								>
									<div className='flex items-start space-x-3 w-full'>
										<div className='flex-shrink-0 mt-0.5'>
											{getNotificationIcon(notification.type)}
										</div>
										<div className='flex-1 min-w-0'>
											<div className='flex justify-between items-start mb-1'>
												<h4
													className={cn(
														'text-sm font-medium',
														!notification.read
															? 'text-foreground'
															: 'text-muted-foreground'
													)}
												>
													{notification.title}
												</h4>
												<span className='text-xs text-muted-foreground whitespace-nowrap'>
													{notification.time}
												</span>
											</div>
											<p className='text-sm text-muted-foreground line-clamp-2'>
												{notification.description}
											</p>
										</div>
										{!notification.read && (
											<div className='flex-shrink-0'>
												<div className='h-2 w-2 rounded-full bg-blue-500' />
											</div>
										)}
									</div>
								</DropdownMenuItem>
							))
						)}
					</DropdownMenuGroup>
				</ScrollArea>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem className='cursor-pointer'>
						<Settings className='mr-2 h-4 w-4' />
						<span>Настройки уведомлений</span>
					</DropdownMenuItem>
					<DropdownMenuItem className='cursor-pointer'>
						<User className='mr-2 h-4 w-4' />
						<span>Показать все уведомления</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default NotificationDropdown
