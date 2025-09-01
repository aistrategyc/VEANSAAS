import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Calendar,
	Clock,
	Plus,
	ChevronLeft,
	ChevronRight,
	Eye,
	Edit,
	User,
	Scissors,
	Euro,
} from 'lucide-react'

export default function CalendarPage() {
	// const [currentDate, setCurrentDate] = useState(new Date())
	// const [selectedDate, setSelectedDate] = (useState < Date) | (null > null)
	const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)

	const appointments = [
		{
			id: 1,
			date: '2024-01-15',
			time: '09:00',
			duration: 150,
			client: 'Анна Петрова',
			phone: '+33 1 23 45 67 89',
			service: 'Стрижка + окрашивание',
			master: 'Елена Кузнецова',
			price: 85,
			status: 'confirmed',
			prepaid: 25,
			notes: 'Клиент просит сохранить длину',
		},
		{
			id: 2,
			date: '2024-01-15',
			time: '10:30',
			duration: 75,
			client: 'Мария Сидорова',
			phone: '+33 1 98 76 54 32',
			service: 'Маникюр',
			master: 'Ольга Морозова',
			price: 35,
			status: 'in-progress',
			prepaid: 0,
			notes: '',
		},
		{
			id: 3,
			date: '2024-01-15',
			time: '12:00',
			duration: 180,
			client: 'Екатерина Иванова',
			phone: '+33 1 11 22 33 44',
			service: 'Татуировка',
			master: 'Дмитрий Волков',
			price: 150,
			status: 'confirmed',
			prepaid: 50,
			notes: 'Эскиз согласован',
		},
	]

	const timeSlots = Array.from({ length: 20 }, (_, i) => {
		const hour = Math.floor(i / 2) + 9
		const minute = i % 2 === 0 ? '00' : '30'
		return `${hour.toString().padStart(2, '0')}:${minute}`
	})

	const getAppointmentForTimeSlot = time => {
		return appointments.find(
			apt => apt.time === time && apt.date === '2024-01-15'
		)
	}

	const getAppointmentHeight = duration => {
		return Math.max(1, Math.ceil(duration / 30)) * 60 // 60px per 30min slot
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Календарь</h1>
					<p className='text-muted-foreground'>
						Управление записями и расписанием
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>
						<Calendar className='h-4 w-4 mr-2' />
						Сегодня
					</Button>
					<Dialog
						open={isNewAppointmentOpen}
						onOpenChange={setIsNewAppointmentOpen}
					>
						<DialogTrigger asChild>
							<Button className='bg-primary hover:bg-primary/90'>
								<Plus className='h-4 w-4 mr-2' />
								Новая запись
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-md'>
							<DialogHeader>
								<DialogTitle>Новая запись</DialogTitle>
								<DialogDescription>
									Создайте новую запись для клиента
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4'>
								<div>
									<Label htmlFor='client'>Клиент</Label>
									<Input id='client' placeholder='Имя клиента' />
								</div>
								<div>
									<Label htmlFor='phone'>Телефон</Label>
									<Input id='phone' placeholder='+33 1 23 45 67 89' />
								</div>
								<div>
									<Label htmlFor='service'>Услуга</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Выберите услугу' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='haircut'>Стрижка - €45</SelectItem>
											<SelectItem value='coloring'>
												Окрашивание - €65
											</SelectItem>
											<SelectItem value='manicure'>Маникюр - €35</SelectItem>
											<SelectItem value='tattoo'>Татуировка - €150</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor='master'>Мастер</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Выберите мастера' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='elena'>Елена Кузнецова</SelectItem>
											<SelectItem value='olga'>Ольга Морозова</SelectItem>
											<SelectItem value='dmitry'>Дмитрий Волков</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='date'>Дата</Label>
										<Input id='date' type='date' />
									</div>
									<div>
										<Label htmlFor='time'>Время</Label>
										<Input id='time' type='time' />
									</div>
								</div>
								<div>
									<Label htmlFor='prepaid'>Предоплата (€)</Label>
									<Input id='prepaid' type='number' placeholder='0' />
								</div>
								<div>
									<Label htmlFor='notes'>Заметки</Label>
									<Textarea
										id='notes'
										placeholder='Дополнительная информация'
									/>
								</div>
								<div className='flex gap-2'>
									<Button
										className='flex-1'
										onClick={() => setIsNewAppointmentOpen(false)}
									>
										Создать запись
									</Button>
									<Button
										variant='outline'
										onClick={() => setIsNewAppointmentOpen(false)}
									>
										Отмена
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Calendar Navigation */}
			<Card className='bg-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<Button variant='outline' size='sm'>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<h2 className='text-xl font-semibold text-foreground'>
								15 января 2024
							</h2>
							<Button variant='outline' size='sm'>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
						<div className='flex gap-2'>
							<Button variant='outline' size='sm'>
								День
							</Button>
							<Button variant='outline' size='sm'>
								Неделя
							</Button>
							<Button variant='outline' size='sm'>
								Месяц
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Calendar Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				{/* Time Schedule */}
				<div className='lg:col-span-3'>
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='text-card-foreground flex items-center gap-2'>
								<Clock className='h-5 w-5 text-primary' />
								Расписание на день
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='relative'>
								{/* Time slots */}
								<div className='space-y-0'>
									{timeSlots.map((time, index) => {
										const appointment = getAppointmentForTimeSlot(time)
										return (
											<div key={time} className='relative'>
												<div className='flex items-center border-b border-border/50 min-h-[60px]'>
													<div className='w-16 text-sm text-muted-foreground font-medium'>
														{time}
													</div>
													<div className='flex-1 pl-4'>
														{appointment && (
															<div
																className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
																	appointment.status === 'confirmed'
																		? 'bg-blue-500/10 border-l-blue-500'
																		: appointment.status === 'in-progress'
																		? 'bg-green-500/10 border-l-green-500'
																		: 'bg-yellow-500/10 border-l-yellow-500'
																}`}
																style={{
																	height: `${getAppointmentHeight(
																		appointment.duration
																	)}px`,
																}}
															>
																<div className='flex items-start justify-between'>
																	<div className='flex-1'>
																		<p className='font-medium text-foreground'>
																			{appointment.client}
																		</p>
																		<p className='text-sm text-muted-foreground'>
																			{appointment.service}
																		</p>
																		<div className='flex items-center gap-2 mt-1'>
																			<Badge
																				variant='outline'
																				className='text-xs'
																			>
																				<User className='h-3 w-3 mr-1' />
																				{appointment.master}
																			</Badge>
																			<Badge
																				variant='outline'
																				className='text-xs'
																			>
																				<Clock className='h-3 w-3 mr-1' />
																				{appointment.duration}мин
																			</Badge>
																			<Badge
																				variant='outline'
																				className='text-xs'
																			>
																				<Euro className='h-3 w-3 mr-1' />
																				{appointment.price}
																			</Badge>
																		</div>
																		{appointment.prepaid > 0 && (
																			<div className='mt-2'>
																				<Badge
																					variant='secondary'
																					className='text-xs'
																				>
																					Предоплата: €{appointment.prepaid}
																				</Badge>
																			</div>
																		)}
																	</div>
																	<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
																		<Button
																			size='sm'
																			variant='ghost'
																			className='h-6 w-6 p-0'
																		>
																			<Eye className='h-3 w-3' />
																		</Button>
																		<Button
																			size='sm'
																			variant='ghost'
																			className='h-6 w-6 p-0'
																		>
																			<Edit className='h-3 w-3' />
																		</Button>
																	</div>
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className='space-y-6'>
					{/* Quick Stats */}
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='text-card-foreground text-lg'>
								Сегодня
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Записей</span>
								<span className='font-medium text-foreground'>24</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Выручка</span>
								<span className='font-medium text-foreground'>€1,230</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									Предоплаты
								</span>
								<span className='font-medium text-foreground'>€285</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									Свободных слотов
								</span>
								<span className='font-medium text-foreground'>8</span>
							</div>
						</CardContent>
					</Card>

					{/* Masters Schedule */}
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='text-card-foreground text-lg'>
								Мастера
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							{[
								{ name: 'Елена К.', appointments: 8, status: 'active' },
								{ name: 'Ольга М.', appointments: 6, status: 'active' },
								{ name: 'Дмитрий В.', appointments: 3, status: 'active' },
								{ name: 'Анна Л.', appointments: 4, status: 'break' },
							].map((master, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/20'
								>
									<div className='flex items-center gap-2'>
										<div
											className={`w-2 h-2 rounded-full ${
												master.status === 'active'
													? 'bg-green-500'
													: 'bg-yellow-500'
											}`}
										/>
										<span className='text-sm font-medium text-foreground'>
											{master.name}
										</span>
									</div>
									<span className='text-sm text-muted-foreground'>
										{master.appointments} записей
									</span>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='text-card-foreground text-lg'>
								Быстрые действия
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<Button
								variant='outline'
								className='w-full justify-start text-sm bg-transparent'
							>
								<Plus className='h-4 w-4 mr-2' />
								Добавить запись
							</Button>
							<Button
								variant='outline'
								className='w-full justify-start text-sm bg-transparent'
							>
								<User className='h-4 w-4 mr-2' />
								Новый клиент
							</Button>
							<Button
								variant='outline'
								className='w-full justify-start text-sm bg-transparent'
							>
								<Scissors className='h-4 w-4 mr-2' />
								Чек-ин клиента
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
