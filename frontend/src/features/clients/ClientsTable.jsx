import { useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	MoreHorizontal,
	Edit,
	Trash2,
	Phone,
	Mail,
	Calendar,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { EmptyState } from '@/components/ui/empty-state'
import { PermissionGuard } from '@/role/PermissionGuard'
import { Link } from 'react-router'

export function ClientsTable({ clients, onEdit, onDelete }) {
	const [sortField, setSortField] = useState('createdAt')
	const [sortDirection, setSortDirection] = useState()

	const handleSort = field => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortDirection('asc')
		}
	}

	const sortedClients = [...clients].sort((a, b) => {
		const aValue = a[sortField]
		const bValue = b[sortField]

		if (aValue === undefined || aValue === null) return 1
		if (bValue === undefined || bValue === null) return -1

		let comparison = 0
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			comparison = aValue.localeCompare(bValue)
		} else if (typeof aValue === 'number' && typeof bValue === 'number') {
			comparison = aValue - bValue
		} else {
			comparison = String(aValue).localeCompare(String(bValue))
		}

		return sortDirection === 'asc' ? comparison : -comparison
	})

	if (clients.length === 0) {
		return (
			<EmptyState
				title='Нет клиентов'
				description='Начните добавлять клиентов в вашу базу данных'
				action={{
					label: 'Добавить первого клиента',
					onClick: () => {
						// This would trigger the parent's create function
					},
				}}
				icon={<Calendar className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>База клиентов ({clients.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Клиент</TableHead>
								<TableHead
									className='cursor-pointer hover:bg-muted/50'
									onClick={() => handleSort('firstName')}
								>
									Имя
								</TableHead>
								<TableHead>Контакты</TableHead>
								<TableHead>Информация</TableHead>
								<TableHead
									className='cursor-pointer hover:bg-muted/50'
									onClick={() => handleSort('createdAt')}
								>
									Дата создания
								</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedClients.map(client => (
								<TableRow key={client.id}>
									<TableCell>
										<div className='flex items-center space-x-3'>
											<Avatar>
												<AvatarFallback>
													{client.firstName[0]}
													{client.lastName[0]}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className='font-medium'>
													<Link to='/clients/1'>
														{client.firstName} {client.lastName}
													</Link>
												</div>
												{client.preferences?.preferredMasters && (
													<div className='text-sm text-muted-foreground'>
														Предпочитаемые мастера:{' '}
														{client.preferences.preferredMasters.length}
													</div>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											<div className='font-medium'>
												{client.firstName} {client.lastName}
											</div>
											{client.gender && (
												<Badge variant='outline' className='text-xs'>
													{client.gender === 'FEMALE'
														? 'Ж'
														: client.gender === 'MALE'
														? 'М'
														: 'Другое'}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											{client.phone && (
												<div className='flex items-center text-sm'>
													<Phone className='h-3 w-3 mr-1 text-muted-foreground' />
													{client.phone}
												</div>
											)}
											{client.email && (
												<div className='flex items-center text-sm'>
													<Mail className='h-3 w-3 mr-1 text-muted-foreground' />
													{client.email}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1 text-sm'>
											{client.dateOfBirth && (
												<div>
													Возраст:{' '}
													{new Date().getFullYear() -
														new Date(client.dateOfBirth).getFullYear()}{' '}
													лет
												</div>
											)}
											{client.preferences?.allergies &&
												client.preferences.allergies.length > 0 && (
													<Badge variant='destructive' className='text-xs'>
														Аллергии
													</Badge>
												)}
											{client.notes && (
												<div className='text-muted-foreground truncate max-w-[200px]'>
													{client.notes}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className='text-sm text-muted-foreground'>
											{format(new Date(client.createdAt), 'd MMM yyyy', {
												locale: ru,
											})}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={client.isActive ? 'default' : 'secondary'}>
											{client.isActive ? 'Активен' : 'Неактивен'}
										</Badge>
									</TableCell>
									<TableCell>
										<PermissionGuard requiredPermission={'client:edit'}>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' className='h-8 w-8 p-0'>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuItem onClick={() => onEdit(client)}>
														<Edit className='mr-2 h-4 w-4' />
														Редактировать
													</DropdownMenuItem>

													<DropdownMenuItem
														onClick={() => onDelete(client.id)}
														className='text-destructive focus:text-destructive'
													>
														<Trash2 className='mr-2 h-4 w-4' />
														Удалить
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</PermissionGuard>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
