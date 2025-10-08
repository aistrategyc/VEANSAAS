import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RoleGuard } from '@/components/ui/role-guard'
import {
	Calendar,
	Clock,
	User,
	MapPin,
	ChevronLeft,
	ChevronRight,
	Plus,
} from 'lucide-react'

// Mock data for schedule
const mockScheduleData = [
	{
		id: '1',
		masterId: '2',
		masterName: 'Мария Иванова',
		date: '2024-01-15',
		timeSlots: [
			{
				time: '09:00',
				duration: 60,
				clientName: 'Анна Петрова',
				serviceName: 'Стрижка и укладка',
				status: 'confirmed',
				location: 'Кресло 1',
			},
			{
				time: '10:30',
				duration: 90,
				clientName: 'Елена Сидорова',
				serviceName: 'Окрашивание',
				status: 'confirmed',
				location: 'Кресло 1',
			},
			{
				time: '14:00',
				duration: 45,
				clientName: null,
				serviceName: null,
				status: 'available',
				location: 'Кресло 1',
			},
			{
				time: '15:00',
				duration: 60,
				clientName: 'Ольга Козлова',
				serviceName: 'Стрижка',
				status: 'pending',
				location: 'Кресло 1',
			},
		],
	},
	{
		id: '2',
		masterId: '3',
		masterName: 'Анна Петрова',
		date: '2024-01-15',
		timeSlots: [
			{
				time: '10:00',
				duration: 60,
				clientName: 'Мария Волкова',
				serviceName: 'Маникюр',
				status: 'confirmed',
				location: 'Стол 1',
			},
			{
				time: '11:30',
				duration: 90,
				clientName: 'Татьяна Белова',
				serviceName: 'Маникюр + дизайн',
				status: 'confirmed',
				location: 'Стол 1',
			},
			{
				time: '15:30',
				duration: 60,
				clientName: null,
				serviceName: null,
				status: 'available',
				location: 'Стол 1',
			},
		],
	},
]

const getStatusColor = status => {
	switch (status) {
		case 'confirmed':
			return 'bg-green-500/20 text-green-600 border-green-500/30'
		case 'pending':
			return 'bg-amber-500/20 text-amber-600 border-amber-500/30'
		case 'available':
			return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
		default:
			return 'bg-gray-500/20 text-gray-600 border-gray-500/30'
	}
}

const getStatusLabel = status => {
	switch (status) {
		case 'confirmed':
			return 'Подтверждено'
		case 'pending':
			return 'Ожидает'
		case 'available':
			return 'Свободно'
		default:
			return 'Неизвестно'
	}
}

export default function SchedulePage() {
	const user = {
		id: '1',
		email: 'admin@salon.com',
		name: 'Анна Администратор',
		role: 'Admin',
		organizationId: 'org1',
		isActive: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	}
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [activeTab, setActiveTab] = useState('day')

	const isOwnSchedule = user?.role === 'admin' || user?.role === 'Student'
	const filteredSchedule = isOwnSchedule
		? mockScheduleData.filter(s => s.masterId === user?.id)
		: mockScheduleData

	const stats = {
		totalSlots: filteredSchedule.reduce(
			(sum, master) => sum + master.timeSlots.length,
			0
		),
		confirmedSlots: filteredSchedule.reduce(
			(sum, master) =>
				sum +
				master.timeSlots.filter(slot => slot.status === 'confirmed').length,
			0
		),
		availableSlots: filteredSchedule.reduce(
			(sum, master) =>
				sum +
				master.timeSlots.filter(slot => slot.status === 'available').length,
			0
		),
		pendingSlots: filteredSchedule.reduce(
			(sum, master) =>
				sum + master.timeSlots.filter(slot => slot.status === 'pending').length,
			0
		),
	}

	const navigateDate = direction => {
		const newDate = new Date(selectedDate)
		newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1))
		setSelectedDate(newDate)
	}

	return (
		<RoleGuard allowedRoles={['Master', 'Student', 'admin', 'MasterOwner']}>
			<div className='min-h-screen bg-background p-6'>
				<div className='mx-auto space-y-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-foreground'>
								{isOwnSchedule ? 'Мое расписание' : 'Расписание команды'}
							</h1>
							<p className='text-muted-foreground'>
								{isOwnSchedule
									? 'Ваши записи и свободное время'
									: 'Расписание всех мастеров'}
							</p>
						</div>
						{user?.role !== 'Student' && (
							<Button className='bg-primary hover:bg-primary/90'>
								<Plus className='w-4 h-4 mr-2' />
								Добавить запись
							</Button>
						)}
					</div>

					{/* Stats Cards */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<Card className='crypto-card'>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<Calendar className='w-5 h-5 text-primary' />
									<div>
										<p className='text-2xl font-bold text-card-foreground'>
											{stats.totalSlots}
										</p>
										<p className='text-sm text-muted-foreground'>
											Всего слотов
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='crypto-card'>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<Clock className='w-5 h-5 text-green-500' />
									<div>
										<p className='text-2xl font-bold text-card-foreground'>
											{stats.confirmedSlots}
										</p>
										<p className='text-sm text-muted-foreground'>
											Подтверждено
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='crypto-card'>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<Clock className='w-5 h-5 text-amber-500' />
									<div>
										<p className='text-2xl font-bold text-card-foreground'>
											{stats.pendingSlots}
										</p>
										<p className='text-sm text-muted-foreground'>Ожидает</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='crypto-card'>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<Clock className='w-5 h-5 text-blue-500' />
									<div>
										<p className='text-2xl font-bold text-card-foreground'>
											{stats.availableSlots}
										</p>
										<p className='text-sm text-muted-foreground'>Свободно</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Date Navigation */}
					<Card className='crypto-card'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between mb-6'>
								<Button
									variant='outline'
									onClick={() => navigateDate('prev')}
									className='border-border text-muted-foreground hover:bg-accent'
								>
									<ChevronLeft className='w-4 h-4 mr-2' />
									Предыдущий день
								</Button>

								<h2 className='text-xl font-semibold text-card-foreground'>
									{selectedDate.toLocaleDateString('ru-RU', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</h2>

								<Button
									variant='outline'
									onClick={() => navigateDate('next')}
									className='border-border text-muted-foreground hover:bg-accent'
								>
									Следующий день
									<ChevronRight className='w-4 h-4 ml-2' />
								</Button>
							</div>

							{/* Schedule Grid */}
							<div className='space-y-6'>
								{filteredSchedule.map(masterSchedule => (
									<Card key={masterSchedule.id} className='crypto-card'>
										<CardHeader className='pb-4'>
											<div className='flex items-center space-x-3'>
												<Avatar className='w-10 h-10'>
													<AvatarImage
														src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${masterSchedule.masterName}`}
														alt={masterSchedule.masterName}
													/>
													<AvatarFallback>
														{masterSchedule.masterName
															.split(' ')
															.map(n => n[0])
															.join('')}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className='text-lg text-card-foreground'>
														{masterSchedule.masterName}
													</CardTitle>
													<CardDescription>Мастер</CardDescription>
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
												{masterSchedule.timeSlots.map((slot, index) => (
													<Card
														key={index}
														className={`border-2 transition-all hover:border-primary/50 ${getStatusColor(
															slot.status
														)}`}
													>
														<CardContent className='p-4'>
															<div className='flex items-center justify-between mb-3'>
																<span className='font-semibold text-card-foreground'>
																	{slot.time}
																</span>
																<Badge variant='outline' className='text-xs'>
																	{slot.duration} мин
																</Badge>
															</div>

															{slot.clientName ? (
																<div className='space-y-2'>
																	<div className='flex items-center space-x-2'>
																		<User className='w-4 h-4 text-muted-foreground' />
																		<span className='text-sm font-medium text-card-foreground'>
																			{slot.clientName}
																		</span>
																	</div>
																	<div className='text-sm text-muted-foreground'>
																		{slot.serviceName}
																	</div>
																	<div className='flex items-center space-x-2'>
																		<MapPin className='w-4 h-4 text-muted-foreground' />
																		<span className='text-xs text-muted-foreground'>
																			{slot.location}
																		</span>
																	</div>
																</div>
															) : (
																<div className='text-center py-4'>
																	<Clock className='w-6 h-6 mx-auto mb-2 text-muted-foreground' />
																	<p className='text-sm text-muted-foreground'>
																		Свободное время
																	</p>
																</div>
															)}

															<div className='mt-3 pt-3 border-t border-border/50'>
																<Badge
																	className={`${getStatusColor(
																		slot.status
																	)} border-none`}
																>
																	{getStatusLabel(slot.status)}
																</Badge>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</RoleGuard>
	)
}
