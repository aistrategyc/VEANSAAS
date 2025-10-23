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

const formatDuration = minutes => {
	if (!minutes) return '—'
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60

	if (hours > 0) {
		return `${hours}ч ${mins}м`
	}
	return `${mins}мин`
}

const formatPrice = price => {
	if (!price && price !== 0) return '—'

	// Если price - объект, берем числовое значение
	const numericPrice =
		typeof price === 'object' ? price.value || price.amount || 0 : price

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
	}).format(numericPrice)
}

const getInitials = name => {
	if (!name || typeof name !== 'string') return '?'
	return name
		.split(' ')
		.map(part => part.charAt(0))
		.join('')
		.toUpperCase()
		.slice(0, 2)
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

// Функция для безопасного извлечения строки из объекта
const safeString = (value, defaultValue = '') => {
	if (typeof value === 'string') return value
	if (typeof value === 'object' && value !== null) {
		return value.name || value.title || value.value || defaultValue
	}
	return defaultValue
}

export function AppointmentsTable({
	appointments,
	clients = [],
	services = [],
	onEdit,
	onDelete,
}) {
	// Преобразуем данные внутри компонента
	const transformClients = clientsList => {
		if (!Array.isArray(clientsList)) return []
		return clientsList.map(client => {
			// Если client - объект, извлекаем нужные поля
			if (typeof client === 'object' && client !== null) {
				return {
					uuid: client.uuid || client.id || '',
					name: safeString(client.name, 'Неизвестный клиент'),
					phone: safeString(client.phone, ''),
				}
			}
			return { uuid: '', name: 'Неизвестный клиент', phone: '' }
		})
	}

	const transformServices = servicesList => {
		if (!Array.isArray(servicesList)) return []
		return servicesList.map(service => {
			// Если service - объект, извлекаем нужные поля
			if (typeof service === 'object' && service !== null) {
				return {
					uuid: service.uuid || service.id || '',
					name: safeString(service.name, 'Неизвестная услуга'),
					price:
						typeof service.price === 'object'
							? service.price.value || service.price.amount || 0
							: service.price || 0,
					category: safeString(service.category, ''),
					duration: service.duration || 0,
				}
			}
			return { uuid: '', name: 'Неизвестная услуга', price: 0, duration: 0 }
		})
	}

	const findClientById = clientId => {
		const transformedClients = transformClients(clients)
		if (!clientId) return null
		return transformedClients.find(client => client.uuid === clientId)
	}

	const findServiceById = serviceId => {
		const transformedServices = transformServices(services)
		if (!serviceId) return null
		return transformedServices.find(service => service.uuid === serviceId)
	}

	// Проверяем appointments на наличие объектов
	const safeAppointments = Array.isArray(appointments)
		? appointments.map(apt => ({
				uuid: apt.uuid || apt.id || '',
				customer_uuid: apt.customer_uuid || apt.client_id || '',
				service_uuid: apt.service_uuid || apt.service_id || '',
				date_time: apt.date_time || apt.datetime || '',
				duration: apt.duration || 0,
				price: apt.price || 0,
				status: apt.status || 'pending',
				note: safeString(apt.note),
				created_at: apt.created_at || '',
		  }))
		: []

	if (!safeAppointments || safeAppointments.length === 0) {
		return (
			<EmptyState
				title='Нет записей'
				description='Создайте первую запись для отображения в этом разделе'
				icon={<Calendar className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='flex items-center justify-between'>
					<span>Список записей</span>
					<Badge variant='secondary' className='ml-2'>
						{safeAppointments.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[180px]'>Дата и время</TableHead>
								<TableHead className='w-[200px]'>Клиент</TableHead>
								<TableHead className='w-[150px]'>Услуга</TableHead>
								<TableHead className='w-[100px]'>Длительность</TableHead>
								<TableHead className='w-[120px]'>Стоимость</TableHead>
								<TableHead className='w-[120px]'>Статус</TableHead>
								<TableHead className='w-[80px]'>Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{safeAppointments.map(appointment => {
								const client = findClientById(appointment.customer_uuid)
								const service = findServiceById(appointment.service_uuid)

								const clientName = client?.name || 'Неизвестный клиент'
								const serviceName = service?.name || 'Неизвестная услуга'
								const servicePrice = service?.price || appointment.price
								const serviceDuration =
									service?.duration || appointment.duration

								return (
									<TableRow
										key={appointment.uuid}
										className='group hover:bg-muted/50'
									>
										<TableCell>
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
										</TableCell>

										<TableCell>
											{appointment.customer_uuid ? (
												<Link
													to={`/clients/${appointment.customer_uuid}`}
													className='hover:no-underline'
												>
													<div className='flex items-center space-x-3'>
														<Avatar className='h-8 w-8'>
															<AvatarFallback className='text-xs bg-primary/10'>
																{getInitials(clientName)}
															</AvatarFallback>
														</Avatar>
														<div className='min-w-0 flex-1'>
															<p className='font-medium text-sm truncate'>
																{clientName}
															</p>
															{client?.phone && (
																<p className='text-xs text-muted-foreground truncate'>
																	{client.phone}
																</p>
															)}
														</div>
													</div>
												</Link>
											) : (
												<div className='flex items-center space-x-3'>
													<Avatar className='h-8 w-8'>
														<AvatarFallback className='text-xs bg-primary/10'>
															?
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-medium text-sm'>
															Неизвестный клиент
														</p>
													</div>
												</div>
											)}
										</TableCell>

										<TableCell>
											<div className='space-y-1'>
												<p className='font-medium text-sm leading-none'>
													{serviceName}
												</p>
												{service?.category && (
													<Badge variant='outline' className='text-xs'>
														{service.category}
													</Badge>
												)}
											</div>
										</TableCell>

										<TableCell>
											<div className='flex items-center space-x-2'>
												<Clock className='h-4 w-4 text-muted-foreground flex-shrink-0' />
												<Badge
													variant='outline'
													className='text-xs font-normal'
												>
													{formatDuration(serviceDuration)}
												</Badge>
											</div>
										</TableCell>

										<TableCell>
											<div className='flex items-center space-x-2'>
												<DollarSign className='h-4 w-4 text-muted-foreground flex-shrink-0' />
												<span className='font-semibold text-sm'>
													{formatPrice(servicePrice)}
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
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														className='h-8 w-8 p-0 opacity-100 group-hover:opacity-100 transition-opacity'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Открыть меню</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-48'>
													<DropdownMenuItem
														onClick={() => onEdit(appointment)}
														className='cursor-pointer'
													>
														<Edit className='mr-2 h-4 w-4' />
														Редактировать
													</DropdownMenuItem>
													{appointment.note && (
														<DropdownMenuItem className='cursor-pointer'>
															<FileText className='mr-2 h-4 w-4' />
															Примечание
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														onClick={() => onDelete(appointment.uuid)}
														className='cursor-pointer text-destructive focus:text-destructive'
													>
														<Trash2 className='mr-2 h-4 w-4' />
														Удалить
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
