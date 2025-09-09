import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	Calendar,
	Clock,
	Edit,
	Mail,
	MessageSquare,
	Phone,
	Plus,
	Star,
	TrendingUp,
	User,
	Scissors,
	Sparkles,
} from 'lucide-react'

// Mock data for demonstration
const clientData = {
	id: '1',
	name: 'Анна Петрова',
	email: 'anna.petrova@email.com',
	phone: '+45 123-45-67',
	avatar: '/woman-portrait.png',
	joinDate: '2023-03-15',
	totalVisits: 12,
	totalSpent: 4560,
	lastVisit: '2024-01-15',
	nextAppointment: '2024-01-25',
	preferredServices: ['Стрижка', 'Окрашивание', 'Укладка'],
	notes: 'Предпочитает натуральные оттенки. Аллергия на аммиак.',
	status: 'VIP',
}

const appointmentHistory = [
	{
		id: 1,
		date: '2024-01-15',
		time: '14:00',
		service: 'Стрижка + Окрашивание',
		master: 'Мария Иванова',
		price: 450,
		status: 'completed',
	},
	{
		id: 2,
		date: '2023-12-20',
		time: '16:30',
		service: 'Укладка',
		master: 'Елена Сидорова',
		price: 200,
		status: 'completed',
	},
	{
		id: 3,
		date: '2023-11-28',
		time: '15:00',
		service: 'Стрижка',
		master: 'Мария Иванова',
		price: 250,
		status: 'completed',
	},
]

const upcomingAppointments = [
	{
		id: 4,
		date: '2024-01-25',
		time: '15:30',
		service: 'Окрашивание корней',
		master: 'Мария Иванова',
		price: 350,
		status: 'scheduled',
	},
]

export default function ProfileLayout({ params }) {
	return (
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-foreground'>
							Карточка клиента
						</h1>
						<p className='text-muted-foreground'>
							Управление информацией о клиенте
						</p>
					</div>
					<div className='flex gap-3'>
						<Button variant='outline' size='sm'>
							<MessageSquare className='h-4 w-4 mr-2' />
							Отправить SMS
						</Button>
						<Button size='sm'>
							<Plus className='h-4 w-4 mr-2' />
							Записать на прием
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Client Info Card */}
					<div className='lg:col-span-1'>
						<Card className='crypto-card'>
							<CardHeader className='text-center pb-4'>
								<div className='flex justify-center mb-4'>
									<Avatar className='h-20 w-20'>
										<AvatarImage
											src={clientData.avatar || '/placeholder.svg'}
											alt={clientData.name}
										/>
										<AvatarFallback className='text-lg'>
											{clientData.name
												.split(' ')
												.map(n => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardTitle className='text-xl'>{clientData.name}</CardTitle>
								<div className='flex justify-center'>
									<Badge
										variant='secondary'
										className='bg-primary/20 text-primary'
									>
										{clientData.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex items-center gap-3 text-sm'>
										<Mail className='h-4 w-4 text-muted-foreground' />
										<span className='text-card-foreground'>
											{clientData.email}
										</span>
									</div>
									<div className='flex items-center gap-3 text-sm'>
										<Phone className='h-4 w-4 text-muted-foreground' />
										<span className='text-card-foreground'>
											{clientData.phone}
										</span>
									</div>
									<div className='flex items-center gap-3 text-sm'>
										<User className='h-4 w-4 text-muted-foreground' />
										<span className='text-card-foreground'>
											Клиент с{' '}
											{new Date(clientData.joinDate).toLocaleDateString(
												'ru-RU'
											)}
										</span>
									</div>
								</div>

								<Separator />

								<div className='grid grid-cols-2 gap-4 text-center'>
									<div>
										<div className='text-2xl font-bold text-primary'>
											{clientData.totalVisits}
										</div>
										<div className='text-xs text-muted-foreground'>Визитов</div>
									</div>
									<div>
										<div className='text-2xl font-bold text-secondary'>
											{clientData.totalSpent.toLocaleString('ru-RU')} $
										</div>
										<div className='text-xs text-muted-foreground'>
											Потрачено
										</div>
									</div>
								</div>

								<Separator />

								<div>
									<h4 className='font-semibold mb-2 text-card-foreground'>
										Предпочитаемые услуги
									</h4>
									<div className='flex flex-wrap gap-2'>
										{clientData.preferredServices.map((service, index) => (
											<Badge key={index} variant='outline' className='text-xs'>
												{service}
											</Badge>
										))}
									</div>
								</div>

								<Button className='w-full bg-transparent' variant='outline'>
									<Edit className='h-4 w-4 mr-2' />
									Редактировать профиль
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className='lg:col-span-2'>
						<Tabs defaultValue='appointments' className='space-y-6'>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='appointments'>Записи</TabsTrigger>
								<TabsTrigger value='history'>История</TabsTrigger>
								<TabsTrigger value='notes'>Заметки</TabsTrigger>
							</TabsList>

							{/* Upcoming Appointments */}
							<TabsContent value='appointments' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<Calendar className='h-5 w-5 text-primary' />
											Предстоящие записи
										</CardTitle>
									</CardHeader>
									<CardContent>
										{upcomingAppointments.length > 0 ? (
											<div className='space-y-4'>
												{upcomingAppointments.map(appointment => (
													<div
														key={appointment.id}
														className='flex items-center justify-between p-4 bg-muted/20 rounded-lg'
													>
														<div className='flex items-center gap-4'>
															<div className='flex flex-col items-center justify-center w-16 h-16 bg-primary/20 rounded-lg'>
																<div className='text-lg font-bold text-primary'>
																	{new Date(appointment.date).getDate()}
																</div>
																<div className='text-xs text-muted-foreground'>
																	{new Date(
																		appointment.date
																	).toLocaleDateString('ru-RU', {
																		month: 'short',
																	})}
																</div>
															</div>
															<div>
																<h4 className='font-semibold text-card-foreground'>
																	{appointment.service}
																</h4>
																<p className='text-sm text-muted-foreground'>
																	Мастер: {appointment.master}
																</p>
																<div className='flex items-center gap-2 text-sm text-muted-foreground'>
																	<Clock className='h-3 w-3' />
																	{appointment.time}
																</div>
															</div>
														</div>
														<div className='text-right'>
															<div className='text-lg font-semibold text-card-foreground'>
																{appointment.price} $
															</div>
															<Badge variant='outline' className='text-xs'>
																Запланировано
															</Badge>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className='text-center py-8 text-muted-foreground'>
												<Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
												<p>Нет предстоящих записей</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Appointment History */}
							<TabsContent value='history' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<TrendingUp className='h-5 w-5 text-secondary' />
											История посещений
										</CardTitle>
										<CardDescription>
											Последний визит:{' '}
											{new Date(clientData.lastVisit).toLocaleDateString(
												'ru-RU'
											)}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											{appointmentHistory.map(appointment => (
												<div
													key={appointment.id}
													className='flex items-center justify-between p-4 border border-border rounded-lg'
												>
													<div className='flex items-center gap-4'>
														<div className='flex items-center justify-center w-10 h-10 bg-secondary/20 rounded-full'>
															{appointment.service.includes('Стрижка') ? (
																<Scissors className='h-4 w-4 text-secondary' />
															) : (
																<Sparkles className='h-4 w-4 text-secondary' />
															)}
														</div>
														<div>
															<h4 className='font-semibold text-card-foreground'>
																{appointment.service}
															</h4>
															<p className='text-sm text-muted-foreground'>
																Мастер: {appointment.master}
															</p>
															<div className='flex items-center gap-2 text-sm text-muted-foreground'>
																<Calendar className='h-3 w-3' />
																{new Date(appointment.date).toLocaleDateString(
																	'ru-RU'
																)}{' '}
																в {appointment.time}
															</div>
														</div>
													</div>
													<div className='text-right'>
														<div className='text-lg font-semibold text-card-foreground'>
															{appointment.price} $
														</div>
														<div className='flex items-center gap-1 text-sm text-green-400'>
															<Star className='h-3 w-3 fill-current' />
															Выполнено
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Notes */}
							<TabsContent value='notes' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<CardTitle className='flex items-center gap-2'>
											<MessageSquare className='h-5 w-5 text-accent' />
											Заметки о клиенте
										</CardTitle>
										<CardDescription>
											Важная информация, предпочтения и особенности
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<Textarea
											placeholder='Добавить заметку о клиенте...'
											defaultValue={clientData.notes}
											className='min-h-[120px] bg-input border-border text-card-foreground'
										/>
										<div className='flex justify-end gap-2'>
											<Button variant='outline' size='sm'>
												Отменить
											</Button>
											<Button size='sm'>Сохранить заметки</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}
