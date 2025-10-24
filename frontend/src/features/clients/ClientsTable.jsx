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
import { EmptyState } from '@/components/ui/empty-state'
import { PermissionGuard } from '@/widgets/permissions/PermissionGuard'
import { Link } from 'react-router'
import { Pagination } from '@/shared/ui/Pagination'

export function ClientsTable({
	clients,
	onEdit,
	onDelete,
	currentPage = 1,
	pageSize = 10,
	totalCount = 20,
	onPageChange,
}) {
	const totalPages = Math.ceil(totalCount / pageSize)
	const startItem = (currentPage - 1) * pageSize + 1
	const endItem = Math.min(currentPage * pageSize, totalCount)

	if (clients.length === 0) {
		return (
			<EmptyState
				title='Нет клиентов'
				description='Начните добавлять клиентов в вашу базу данных'
				action={{
					label: 'Добавить первого клиента',
					onClick: () => {},
				}}
				icon={<Calendar className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
				<CardTitle>База клиентов ({totalCount})</CardTitle>
				{totalPages > 1 && (
					<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
						<span>
							{startItem}-{endItem} из {totalCount}
						</span>
					</div>
				)}
			</CardHeader>
			<CardContent>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Клиент</TableHead>
								<TableHead>Имя</TableHead>
								<TableHead>Пол</TableHead>
								<TableHead>Контакты</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead className='w-[50px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{clients.map(client => (
								<TableRow key={client.uuid}>
									<TableCell>
										<Link to={`/clients/${client.uuid}`}>
											<div className='flex items-center space-x-3'>
												<Avatar>
													<AvatarFallback>
														{client.first_name?.[0]}
														{client.last_name?.[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className='font-medium'>
														{client.first_name} {client.last_name}
													</div>
													{client.preferences?.preferredMasters && (
														<div className='text-sm text-muted-foreground'>
															Предпочитаемые мастера:{' '}
															{client.preferences.preferredMasters.length}
														</div>
													)}
												</div>
											</div>
										</Link>
									</TableCell>

									<TableCell>
										<div className='space-y-1'>
											{client.first_name} {client.last_name}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											{client.gender && (
												<Badge variant='outline' className='text-xs'>
													{client.gender === 'female'
														? 'Ж'
														: client.gender === 'male'
														? 'М'
														: 'Другое'}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className='space-y-1'>
											{client.phone_number && (
												<div className='flex items-center text-sm'>
													<Phone className='h-3 w-3 mr-1 text-muted-foreground' />
													{client.phone_number}
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
										<Badge variant={client.is_active ? 'default' : 'secondary'}>
											{client.is_active ? 'Активен' : 'Неактивен'}
										</Badge>
									</TableCell>
									<TableCell>
										<PermissionGuard requiredAny={['client:edit']}>
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
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalCount={totalCount}
						pageSize={pageSize}
						onPageChange={onPageChange}
					/>
				)}
			</CardContent>
		</Card>
	)
}
