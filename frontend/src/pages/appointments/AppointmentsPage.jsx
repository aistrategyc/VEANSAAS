import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Calendar,
	Clock,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	User,
} from 'lucide-react'

export default function AppointmentsPage() {
	const appointments = [
		{
			id: 1,
			time: '09:00',
			date: '2024-01-15',
			client: 'Анна Петрова',
			phone: '+33 1 23 45 67 89',
			service: 'Стрижка + окрашивание',
			master: 'Елена Кузнецова',
			duration: '2ч 30мин',
			price: '€85',
			status: 'confirmed',
			prepaid: '€25',
			notes: 'Клиент просит сохранить длину',
		},
		{
			id: 2,
			time: '10:30',
			date: '2024-01-15',
			client: 'Мария Сидорова',
			phone: '+33 1 98 76 54 32',
			service: 'Маникюр',
			master: 'Ольга Морозова',
			duration: '1ч 30мин',
			price: '€35',
			status: 'in-progress',
			prepaid: '€0',
			notes: '',
		},
		{
			id: 3,
			time: '12:00',
			date: '2024-01-15',
			client: 'Екатерина Иванова',
			phone: '+33 1 11 22 33 44',
			service: 'Татуировка',
			master: 'Дмитрий Волков',
			duration: '3ч',
			price: '€150',
			status: 'confirmed',
			prepaid: '€50',
			notes: 'Эскиз согласован',
		},
		{
			id: 4,
			time: '14:00',
			date: '2024-01-15',
			client: 'Светлана Козлова',
			phone: '+33 1 56 78 90 12',
			service: 'Пирсинг',
			master: 'Анна Лебедева',
			duration: '30мин',
			price: '€25',
			status: 'pending',
			prepaid: '€0',
			notes: '',
		},
	]

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Записи</h1>
					<p className='text-muted-foreground'>Управление записями клиентов</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>
						<User className='h-4 w-4 mr-2' />
						Чек-ин
					</Button>
					<Button className='bg-primary hover:bg-primary/90'>
						<Plus className='h-4 w-4 mr-2' />
						Новая запись
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card className='bg-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Поиск по клиенту, мастеру или услуге...'
								className='pl-10'
							/>
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Фильтры
						</Button>
						<Button variant='outline'>
							<Calendar className='h-4 w-4 mr-2' />
							Сегодня
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Appointments Table */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>Список записей</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{appointments.map(appointment => (
							<div
								key={appointment.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 group'
							>
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-2'>
										<Clock className='h-4 w-4 text-muted-foreground' />
										<div>
											<p className='font-medium text-foreground'>
												{appointment.time}
											</p>
											<p className='text-xs text-muted-foreground'>
												{appointment.date}
											</p>
										</div>
									</div>
									<div className='flex-1'>
										<p className='font-medium text-foreground'>
											{appointment.client}
										</p>
										<p className='text-sm text-muted-foreground'>
											{appointment.phone}
										</p>
									</div>
									<div>
										<p className='font-medium text-foreground'>
											{appointment.service}
										</p>
										<p className='text-sm text-muted-foreground'>
											Мастер: {appointment.master}
										</p>
										{appointment.notes && (
											<p className='text-xs text-muted-foreground mt-1'>
												💬 {appointment.notes}
											</p>
										)}
									</div>
									<div className='text-right'>
										<p className='font-medium text-foreground'>
											{appointment.price}
										</p>
										<p className='text-sm text-muted-foreground'>
											{appointment.duration}
										</p>
										{appointment.prepaid !== '€0' && (
											<Badge variant='secondary' className='text-xs mt-1'>
												Предоплата: {appointment.prepaid}
											</Badge>
										)}
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<Badge
										variant={
											appointment.status === 'confirmed'
												? 'default'
												: appointment.status === 'in-progress'
												? 'secondary'
												: 'outline'
										}
									>
										{appointment.status === 'confirmed'
											? 'Подтверждено'
											: appointment.status === 'in-progress'
											? 'В процессе'
											: 'Ожидает'}
									</Badge>
									<div className='flex items-center gap-1'>
										<Button size='sm' variant='ghost'>
											<Eye className='h-4 w-4' />
										</Button>
										<Button size='sm' variant='ghost'>
											<Edit className='h-4 w-4' />
										</Button>
										<Button size='sm' variant='ghost'>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
