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
	Calendar,
	Clock,
	DollarSign,
	FileText,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { Link } from 'react-router'
import { Pagination } from '@/shared/ui/Pagination'

// Вспомогательные функции для форматирования
const formatDateTime = dateString => {
	if (!dateString) return '—'
	try {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	} catch {
		return '—'
	}
}

const getStatusVariant = status => {
	switch (status) {
		case 'confirmed':
			return 'default'
		case 'completed':
			return 'secondary'
		case 'cancelled':
			return 'destructive'
		default:
			return 'outline'
	}
}

const getStatusText = status => {
	if (!status) return 'Ожидание'

	switch (status) {
		case 'confirmed':
			return 'Подтверждена'
		case 'completed':
			return 'Завершена'
		case 'cancelled':
			return 'Отменена'
		default:
			return 'Ожидание'
	}
}

export function AppointmentsTable({
	appointments,
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

	if (appointments.length === 0) {
		return (
			<EmptyState
				title='Нет записей'
				description='Создайте первую запись для отображения в этом разделе'
				icon={<Calendar className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}
	console.log(appointments)

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='flex items-center justify-between'>
					<span>Список записей</span>
					{totalPages > 1 && (
						<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
							<span>
								{startItem}-{endItem} из {totalCount}
							</span>
						</div>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[180px]'>Дата и время</TableHead>
								<TableHead className='w-[100px]'>Клиент</TableHead>
								<TableHead className='w-[100px]'>Мастер</TableHead>
								<TableHead className='w-[150px]'>Услуга</TableHead>
								<TableHead className='w-[100px]'>Длительность</TableHead>
								<TableHead className='w-[120px]'>Стоимость</TableHead>
								<TableHead className='w-[120px]'>Статус</TableHead>
								<TableHead className='w-[80px]'>Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{appointments.map(appointment => {
								return (
									<TableRow
										key={appointment.uuid}
										className='group hover:bg-muted/50'
									>
										<TableCell>
											<Link
												to={`/clients/${appointment.uuid}`}
												className='hover:no-underline'
											>
												<div className='flex items-center space-x-2 min-w-[140px]'>
													<Calendar className='h-4 w-4 text-muted-foreground flex-shrink-0' />
													<div className='flex flex-col'>
														<span className='font-medium text-sm whitespace-nowrap'>
															{formatDateTime(appointment.date_time)}
														</span>
														<span className='text-xs text-muted-foreground'>
															{appointment.date_time
																? new Date(
																		appointment.date_time
																  ).toLocaleDateString('ru-RU', {
																		weekday: 'short',
																  })
																: ''}
														</span>
													</div>
												</div>
											</Link>
										</TableCell>

										<TableCell>
											<Link
												to={`/clients/${appointment.customer_uuid}`}
												className='hover:no-underline'
											>
												<div className='flex items-center space-x-3'>
													<div className='min-w-0 flex-1'>
														<p className='font-medium text-sm truncate'>
															{appointment.customer_uuid}
														</p>
													</div>
												</div>
											</Link>
										</TableCell>
										<TableCell>
											<Link
												to={`/master/${appointment.master.uuid}`}
												className='hover:no-underline'
											>
												<div className='flex items-center space-x-3'>
													<div className='min-w-0 flex-1'>
														<p className='font-medium text-sm truncate'>
															{appointment.master.first_name}{' '}
															{appointment.master.last_name}
														</p>
													</div>
												</div>
											</Link>
										</TableCell>

										<TableCell>
											<div className='space-y-1'>
												<p className='font-medium text-sm leading-none'>
													{appointment.service.name}
												</p>
											</div>
										</TableCell>

										<TableCell>
											<div className='flex items-center space-x-2'>
												<Clock className='h-4 w-4 text-muted-foreground flex-shrink-0' />
												<Badge
													variant='outline'
													className='text-xs font-normal'
												>
													{appointment.duration} min
												</Badge>
											</div>
										</TableCell>

										<TableCell>
											<div className='flex items-center space-x-2'>
												<DollarSign className='h-4 w-4 text-muted-foreground flex-shrink-0' />
												<span className='font-semibold text-sm'>
													{appointment.price}
												</span>
											</div>
										</TableCell>

										<TableCell>
											<Badge
												variant={getStatusVariant(appointment.status)}
												className='text-xs'
											>
												{getStatusText(appointment.status)}
											</Badge>
										</TableCell>

										<TableCell>
											<div className='flex items-center justify-end space-x-1 pr-2'>
												{true && (
													<Button
														variant='ghost'
														size='sm'
														onClick={() => onEdit(appointment)}
														className='h-8 w-8 p-0 hover:bg-primary/10'
													>
														<Edit className='h-4 w-4' />
														<span className='sr-only'>Редактировать</span>
													</Button>
												)}
												{true && (
													<Button
														variant='ghost'
														size='sm'
														onClick={() => onDelete(appointment)}
														className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
													>
														<Trash2 className='h-4 w-4' />
														<span className='sr-only'>Удалить</span>
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								)
							})}
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
