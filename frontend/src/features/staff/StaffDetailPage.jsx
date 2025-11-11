import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	ArrowLeft,
	Star,
	Phone,
	Mail,
	MapPin,
	Calendar,
	Clock,
	Award,
	TrendingUp,
	Wallet,
	Target,
	Users,
	CheckCircle2,
	Trophy,
	BarChart3,
	DollarSign,
	Gift,
	GraduationCap,
	Scissors,
	Palette,
	Edit,
	MessageSquare,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router'

const StaffDetailPage = () => {
	const [activeTab, setActiveTab] = useState('overview')

	const { uuid } = useParams()
	const navigate = useNavigate()

	// Mock data - в реальном приложении загружать по ID
	const staff = {
		id: uuid,
		name: 'Елена Кузнецова',
		role: 'Парикмахер-стилист',
		grade: 'Senior',
		phone: '+33 1 42 86 83 26',
		email: 'elena.kuznetsova@salon.eu',
		address: 'Paris, France',
		rating: 4.9,
		experience: '8 лет',
		employmentDate: '01.03.2020',
		status: 'active',
		specializations: ['Стрижки', 'Окрашивание', 'Укладки', 'Кератин'],
		certificates: [
			{
				name: 'Международный стилист',
				date: '15.06.2021',
				issuer: 'International Hair Academy',
			},
			{
				name: "Колорист L'Oreal",
				date: '20.09.2022',
				issuer: "L'Oreal Professional",
			},
			{
				name: 'Кератиновое выпрямление',
				date: '10.03.2023',
				issuer: 'Beauty School Paris',
			},
		],
		wallet: {
			balance: '€2,450',
			pending: '€890',
			total: '€3,340',
		},
		installments: [
			{
				item: 'Профессиональные ножницы',
				amount: '€450',
				paid: '€200',
				remaining: '€250',
				dueDate: '15.02.2025',
			},
			{
				item: 'Обучение колористике',
				amount: '€800',
				paid: '€800',
				remaining: '€0',
				dueDate: 'Оплачено',
			},
		],
		kpi: {
			planFulfillment: 112,
			monthlyTarget: '€6,500',
			currentRevenue: '€7,280',
			clientRetention: 94,
			averageCheck: '€65',
			appointmentsCompleted: 112,
			appointmentsTarget: 100,
		},
		upcomingAppointments: [
			{
				id: 1,
				client: 'Мария Петрова',
				service: 'Окрашивание + стрижка',
				time: '10:00',
				date: 'Сегодня',
				amount: '€120',
			},
			{
				id: 2,
				client: 'Анна Сидорова',
				service: 'Укладка',
				time: '12:30',
				date: 'Сегодня',
				amount: '€45',
			},
			{
				id: 3,
				client: 'Ольга Морозова',
				service: 'Кератин',
				time: '15:00',
				date: 'Сегодня',
				amount: '€180',
			},
			{
				id: 4,
				client: 'Елена Волкова',
				service: 'Стрижка + окрашивание',
				time: '09:00',
				date: 'Завтра',
				amount: '€95',
			},
		],
		tasks: [
			{
				id: 1,
				title: 'Подготовить отчет о продажах',
				status: 'completed',
				priority: 'high',
				dueDate: 'Сегодня',
			},
			{
				id: 2,
				title: 'Проверить наличие красителей',
				status: 'in-progress',
				priority: 'medium',
				dueDate: 'Завтра',
			},
			{
				id: 3,
				title: 'Обновить портфолио',
				status: 'pending',
				priority: 'low',
				dueDate: '31.01.2025',
			},
			{
				id: 4,
				title: 'Провести консультацию с новым клиентом',
				status: 'completed',
				priority: 'high',
				dueDate: 'Вчера',
			},
		],
		trainings: [
			{
				name: 'Современные техники окрашивания',
				date: '15.01.2025',
				duration: '16 часов',
				status: 'completed',
				grade: 'A',
			},
			{
				name: 'Работа с проблемными волосами',
				date: '10.12.2024',
				duration: '8 часов',
				status: 'completed',
				grade: 'A+',
			},
			{
				name: 'Продажи услуг и продуктов',
				date: '05.02.2025',
				duration: '4 часа',
				status: 'upcoming',
				grade: '-',
			},
		],
		services: [
			{
				name: 'Женская стрижка',
				price: '€45-75',
				duration: '60 мин',
				count: 45,
			},
			{ name: 'Окрашивание', price: '€80-150', duration: '120 мин', count: 38 },
			{ name: 'Укладка', price: '€35-55', duration: '45 мин', count: 29 },
			{ name: 'Кератин', price: '€180-250', duration: '180 мин', count: 12 },
		],
		motivation: {
			baseSalary: '€2,500',
			commission: '15%',
			bonuses: '€450',
			currentMonth: '€4,340',
			lastMonth: '€3,980',
			growth: '+9%',
		},
	}

	return (
		<div className='space-y-6 pb-8'>
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => navigate(-1)}
					className='hover:bg-muted'
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div className='flex-1'>
					<h1 className='text-3xl font-bold text-foreground'>
						Профиль сотрудника
					</h1>
					<p className='text-muted-foreground'>
						Детальная информация и статистика
					</p>
				</div>
				<Button variant='outline' className='gap-2 bg-transparent'>
					<MessageSquare className='h-4 w-4' />
					Отправить сообщение
				</Button>
				<Button className='gap-2 bg-primary hover:bg-primary/90'>
					<Edit className='h-4 w-4' />
					Редактировать
				</Button>
			</div>
			<Card className='bg-gradient-to-br from-primary/10 via-card to-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex items-start gap-6'>
						<Avatar className='h-24 w-24 border-4 border-primary/20'>
							<AvatarFallback className='text-2xl bg-primary/20'>
								{staff.name
									.split(' ')
									.map(n => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h2 className='text-2xl font-bold text-foreground'>
									{staff.name}
								</h2>
								<Badge className='bg-gradient-to-r from-yellow-500 to-orange-500'>
									<Trophy className='h-3 w-3 mr-1' />
									{staff.grade}
								</Badge>
								<Badge
									variant={staff.status === 'active' ? 'default' : 'secondary'}
								>
									{staff.status === 'active' ? 'Активен' : 'Неактивен'}
								</Badge>
							</div>
							<p className='text-lg text-muted-foreground mb-4'>{staff.role}</p>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Phone className='h-4 w-4 text-primary' />
									{staff.phone}
								</div>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Mail className='h-4 w-4 text-primary' />
									{staff.email}
								</div>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<MapPin className='h-4 w-4 text-primary' />
									{staff.address}
								</div>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Calendar className='h-4 w-4 text-primary' />С{' '}
									{staff.employmentDate}
								</div>
							</div>
						</div>
						<div className='text-right'>
							<div className='flex items-center gap-2 mb-2'>
								<Star className='h-5 w-5 text-yellow-500 fill-current' />
								<span className='text-3xl font-bold text-foreground'>
									{staff.rating}
								</span>
							</div>
							<p className='text-sm text-muted-foreground'>Рейтинг мастера</p>
							<p className='text-xs text-muted-foreground mt-1'>
								{staff.experience} опыта
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card className='bg-gradient-to-br from-green-500/10 to-card border-green-500/20 hover:shadow-lg transition-shadow'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between mb-2'>
							<Target className='h-8 w-8 text-green-500' />
							<Badge className='bg-green-500/20 text-green-500'>
								{staff.kpi.planFulfillment}%
							</Badge>
						</div>
						<p className='text-2xl font-bold text-foreground'>
							{staff.kpi.currentRevenue}
						</p>
						<p className='text-sm text-muted-foreground'>
							План: {staff.kpi.monthlyTarget}
						</p>
						<Progress value={staff.kpi.planFulfillment} className='mt-2 h-2' />
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-blue-500/10 to-card border-blue-500/20 hover:shadow-lg transition-shadow'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between mb-2'>
							<Wallet className='h-8 w-8 text-blue-500' />
							<TrendingUp className='h-5 w-5 text-blue-500' />
						</div>
						<p className='text-2xl font-bold text-foreground'>
							{staff.wallet.balance}
						</p>
						<p className='text-sm text-muted-foreground'>
							Ожидает: {staff.wallet.pending}
						</p>
						<p className='text-xs text-green-500 mt-1'>+€450 за неделю</p>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-purple-500/10 to-card border-purple-500/20 hover:shadow-lg transition-shadow'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between mb-2'>
							<Users className='h-8 w-8 text-purple-500' />
							<Badge className='bg-purple-500/20 text-purple-500'>
								{staff.kpi.clientRetention}%
							</Badge>
						</div>
						<p className='text-2xl font-bold text-foreground'>
							{staff.kpi.appointmentsCompleted}
						</p>
						<p className='text-sm text-muted-foreground'>
							Цель: {staff.kpi.appointmentsTarget} сеансов
						</p>
						<p className='text-xs text-green-500 mt-1'>+12 к прошлому месяцу</p>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-orange-500/10 to-card border-orange-500/20 hover:shadow-lg transition-shadow'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between mb-2'>
							<DollarSign className='h-8 w-8 text-orange-500' />
							<TrendingUp className='h-5 w-5 text-orange-500' />
						</div>
						<p className='text-2xl font-bold text-foreground'>
							{staff.kpi.averageCheck}
						</p>
						<p className='text-sm text-muted-foreground'>Средний чек</p>
						<p className='text-xs text-green-500 mt-1'>+€5 к прошлому месяцу</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className='grid grid-cols-2 lg:grid-cols-6 w-full'>
					<TabsTrigger value='overview'>Обзор</TabsTrigger>
					<TabsTrigger value='motivation'>Мотивация</TabsTrigger>
					<TabsTrigger value='appointments'>Визиты</TabsTrigger>
					<TabsTrigger value='tasks'>Задачи</TabsTrigger>
					<TabsTrigger value='trainings'>Обучения</TabsTrigger>
					<TabsTrigger value='services'>Услуги</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value='overview' className='space-y-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Wallet */}
						<Card className='bg-card border-border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Wallet className='h-5 w-5 text-primary' />
									Баланс кошелька
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20'>
									<div>
										<p className='text-sm text-muted-foreground'>Доступно</p>
										<p className='text-3xl font-bold text-foreground'>
											{staff.wallet.balance}
										</p>
									</div>
									<Button className='bg-green-500 hover:bg-green-600'>
										Вывести
									</Button>
								</div>
								<div className='flex items-center justify-between p-4 bg-muted/20 rounded-lg'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Ожидает подтверждения
										</p>
										<p className='text-xl font-bold text-foreground'>
											{staff.wallet.pending}
										</p>
									</div>
									<Clock className='h-6 w-6 text-yellow-500' />
								</div>
								<div className='flex items-center justify-between p-4 bg-primary/10 rounded-lg'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Всего заработано
										</p>
										<p className='text-xl font-bold text-foreground'>
											{staff.wallet.total}
										</p>
									</div>
									<TrendingUp className='h-6 w-6 text-primary' />
								</div>
							</CardContent>
						</Card>

						{/* Installments */}
						<Card className='bg-card border-border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Gift className='h-5 w-5 text-primary' />
									Рассрочка от компании
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{staff.installments.map((installment, index) => (
									<div
										key={index}
										className='p-4 bg-muted/20 rounded-lg space-y-2'
									>
										<div className='flex items-center justify-between'>
											<p className='font-medium text-foreground'>
												{installment.item}
											</p>
											<Badge
												variant={
													installment.remaining === '€0'
														? 'default'
														: 'secondary'
												}
											>
												{installment.remaining === '€0'
													? 'Оплачено'
													: 'В процессе'}
											</Badge>
										</div>
										<div className='flex items-center justify-between text-sm'>
											<span className='text-muted-foreground'>
												Сумма: {installment.amount}
											</span>
											<span className='text-muted-foreground'>
												Оплачено: {installment.paid}
											</span>
										</div>
										{installment.remaining !== '€0' && (
											<>
												<Progress
													value={
														(Number.parseFloat(
															installment.paid.replace('€', '')
														) /
															Number.parseFloat(
																installment.amount.replace('€', '')
															)) *
														100
													}
													className='h-2'
												/>
												<div className='flex items-center justify-between text-sm'>
													<span className='text-muted-foreground'>
														Осталось: {installment.remaining}
													</span>
													<span className='text-xs text-muted-foreground'>
														До {installment.dueDate}
													</span>
												</div>
											</>
										)}
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Specializations & Certificates */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card className='bg-card border-border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Scissors className='h-5 w-5 text-primary' />
									Специализации
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-wrap gap-2'>
									{staff.specializations.map((spec, index) => (
										<Badge
											key={index}
											variant='outline'
											className='px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors'
										>
											{spec}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className='bg-card border-border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Award className='h-5 w-5 text-primary' />
									Сертификаты ({staff.certificates.length})
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								{staff.certificates.map((cert, index) => (
									<div
										key={index}
										className='flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors'
									>
										<CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5' />
										<div className='flex-1'>
											<p className='font-medium text-foreground'>{cert.name}</p>
											<p className='text-xs text-muted-foreground'>
												{cert.issuer}
											</p>
											<p className='text-xs text-muted-foreground mt-1'>
												Получен: {cert.date}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Motivation Tab */}
				<TabsContent value='motivation' className='space-y-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card className='bg-gradient-to-br from-green-500/10 to-card border-green-500/20'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<DollarSign className='h-5 w-5 text-green-500' />
									Структура дохода
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
										<span className='text-muted-foreground'>
											Базовая ставка
										</span>
										<span className='font-bold text-foreground'>
											{staff.motivation.baseSalary}
										</span>
									</div>
									<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
										<span className='text-muted-foreground'>
											Комиссия ({staff.motivation.commission})
										</span>
										<span className='font-bold text-foreground'>€1,390</span>
									</div>
									<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
										<span className='text-muted-foreground'>Бонусы</span>
										<span className='font-bold text-green-500'>
											{staff.motivation.bonuses}
										</span>
									</div>
									<div className='flex items-center justify-between p-4 bg-gradient-to-r from-primary/20 to-transparent rounded-lg border border-primary/30'>
										<span className='font-medium text-foreground'>
											Итого за месяц
										</span>
										<span className='text-2xl font-bold text-foreground'>
											{staff.motivation.currentMonth}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='bg-card border-border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<BarChart3 className='h-5 w-5 text-primary' />
									Динамика доходов
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
										<span className='text-muted-foreground'>Текущий месяц</span>
										<span className='font-bold text-foreground'>
											{staff.motivation.currentMonth}
										</span>
									</div>
									<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
										<span className='text-muted-foreground'>Прошлый месяц</span>
										<span className='font-bold text-foreground'>
											{staff.motivation.lastMonth}
										</span>
									</div>
									<div className='flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-transparent rounded-lg border border-green-500/30'>
										<span className='font-medium text-foreground'>Рост</span>
										<div className='flex items-center gap-2'>
											<TrendingUp className='h-5 w-5 text-green-500' />
											<span className='text-2xl font-bold text-green-500'>
												{staff.motivation.growth}
											</span>
										</div>
									</div>
								</div>
								<div className='mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20'>
									<p className='text-sm font-medium text-foreground mb-2'>
										🎯 Бонус за выполнение плана
									</p>
									<p className='text-xs text-muted-foreground'>
										За превышение плана на 10% получен бонус +€350. Продолжайте
										в том же духе!
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Appointments Tab */}
				<TabsContent value='appointments' className='space-y-6'>
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Calendar className='h-5 w-5 text-primary' />
								Предстоящие визиты
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							{staff.upcomingAppointments.map(appointment => (
								<div
									key={appointment.id}
									className='flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all'
								>
									<div className='flex items-center gap-4'>
										<div className='text-center p-2 bg-primary/10 rounded-lg'>
											<p className='text-xs text-muted-foreground'>
												{appointment.date}
											</p>
											<p className='text-lg font-bold text-foreground'>
												{appointment.time}
											</p>
										</div>
										<div>
											<p className='font-medium text-foreground'>
												{appointment.client}
											</p>
											<p className='text-sm text-muted-foreground'>
												{appointment.service}
											</p>
										</div>
									</div>
									<div className='text-right'>
										<p className='text-lg font-bold text-foreground'>
											{appointment.amount}
										</p>
										<Button
											size='sm'
											variant='outline'
											className='mt-2 bg-transparent'
										>
											Подробнее
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
						<Card className='bg-gradient-to-br from-blue-500/10 to-card border-blue-500/20'>
							<CardContent className='pt-6'>
								<p className='text-sm text-muted-foreground mb-1'>
									Записей сегодня
								</p>
								<p className='text-3xl font-bold text-foreground'>8</p>
								<p className='text-xs text-green-500 mt-1'>
									Ожидаемая сумма: €545
								</p>
							</CardContent>
						</Card>
						<Card className='bg-gradient-to-br from-purple-500/10 to-card border-purple-500/20'>
							<CardContent className='pt-6'>
								<p className='text-sm text-muted-foreground mb-1'>
									На этой неделе
								</p>
								<p className='text-3xl font-bold text-foreground'>32</p>
								<p className='text-xs text-green-500 mt-1'>
									Ожидаемая сумма: €2,180
								</p>
							</CardContent>
						</Card>
						<Card className='bg-gradient-to-br from-orange-500/10 to-card border-orange-500/20'>
							<CardContent className='pt-6'>
								<p className='text-sm text-muted-foreground mb-1'>
									В этом месяце
								</p>
								<p className='text-3xl font-bold text-foreground'>112</p>
								<p className='text-xs text-green-500 mt-1'>
									Выполнено: {staff.kpi.currentRevenue}
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Tasks Tab */}
				<TabsContent value='tasks' className='space-y-6'>
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<CheckCircle2 className='h-5 w-5 text-primary' />
								Задачи и КПИ
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							{staff.tasks.map(task => (
								<div
									key={task.id}
									className='flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all'
								>
									<div className='flex items-center gap-4'>
										<div
											className={`h-10 w-10 rounded-full flex items-center justify-center ${
												task.status === 'completed'
													? 'bg-green-500/20'
													: task.status === 'in-progress'
													? 'bg-blue-500/20'
													: 'bg-gray-500/20'
											}`}
										>
											{task.status === 'completed' ? (
												<CheckCircle2 className='h-5 w-5 text-green-500' />
											) : task.status === 'in-progress' ? (
												<Clock className='h-5 w-5 text-blue-500' />
											) : (
												<Calendar className='h-5 w-5 text-gray-500' />
											)}
										</div>
										<div>
											<p className='font-medium text-foreground'>
												{task.title}
											</p>
											<p className='text-xs text-muted-foreground'>
												Срок: {task.dueDate}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<Badge
											variant={
												task.priority === 'high'
													? 'destructive'
													: task.priority === 'medium'
													? 'default'
													: 'secondary'
											}
										>
											{task.priority === 'high'
												? 'Высокий'
												: task.priority === 'medium'
												? 'Средний'
												: 'Низкий'}
										</Badge>
										<Badge
											variant={
												task.status === 'completed'
													? 'default'
													: task.status === 'in-progress'
													? 'secondary'
													: 'outline'
											}
										>
											{task.status === 'completed'
												? 'Завершено'
												: task.status === 'in-progress'
												? 'В работе'
												: 'Ожидает'}
										</Badge>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card className='bg-gradient-to-br from-green-500/10 to-card border-green-500/20'>
							<CardHeader>
								<CardTitle className='text-lg'>Выполнение задач</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											Завершено
										</span>
										<span className='font-bold text-foreground'>75%</span>
									</div>
									<Progress value={75} className='h-2' />
									<p className='text-xs text-muted-foreground'>
										3 из 4 задач выполнено в срок
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className='bg-gradient-to-br from-blue-500/10 to-card border-blue-500/20'>
							<CardHeader>
								<CardTitle className='text-lg'>Продуктивность</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-muted-foreground'>
											Индекс эффективности
										</span>
										<span className='font-bold text-foreground'>92%</span>
									</div>
									<Progress value={92} className='h-2' />
									<p className='text-xs text-muted-foreground'>
										Выше среднего по команде на 8%
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Trainings Tab */}
				<TabsContent value='trainings' className='space-y-6'>
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<GraduationCap className='h-5 w-5 text-primary' />
								История обучений
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							{staff.trainings.map((training, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all'
								>
									<div className='flex items-center gap-4'>
										<div
											className={`h-12 w-12 rounded-full flex items-center justify-center ${
												training.status === 'completed'
													? 'bg-green-500/20'
													: training.status === 'upcoming'
													? 'bg-blue-500/20'
													: 'bg-gray-500/20'
											}`}
										>
											<GraduationCap
												className={`h-6 w-6 ${
													training.status === 'completed'
														? 'text-green-500'
														: training.status === 'upcoming'
														? 'text-blue-500'
														: 'text-gray-500'
												}`}
											/>
										</div>
										<div>
											<p className='font-medium text-foreground'>
												{training.name}
											</p>
											<p className='text-sm text-muted-foreground'>
												{training.date} • {training.duration}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-3'>
										{training.grade !== '-' && (
											<div className='text-center p-2 bg-primary/10 rounded-lg'>
												<p className='text-xs text-muted-foreground'>Оценка</p>
												<p className='text-lg font-bold text-primary'>
													{training.grade}
												</p>
											</div>
										)}
										<Badge
											variant={
												training.status === 'completed'
													? 'default'
													: training.status === 'upcoming'
													? 'secondary'
													: 'outline'
											}
										>
											{training.status === 'completed'
												? 'Завершено'
												: training.status === 'upcoming'
												? 'Запланировано'
												: 'В процессе'}
										</Badge>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Services Tab */}
				<TabsContent value='services' className='space-y-6'>
					<Card className='bg-card border-border'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Palette className='h-5 w-5 text-primary' />
								Услуги и стили
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{staff.services.map((service, index) => (
									<div
										key={index}
										className='p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/10 hover:border-primary/30 transition-all'
									>
										<div className='flex items-center justify-between mb-3'>
											<p className='font-medium text-foreground'>
												{service.name}
											</p>
											<Badge variant='outline'>{service.count} сеансов</Badge>
										</div>
										<div className='space-y-2 text-sm text-muted-foreground'>
											<div className='flex items-center justify-between'>
												<span>Цена:</span>
												<span className='font-medium text-foreground'>
													{service.price}
												</span>
											</div>
											<div className='flex items-center justify-between'>
												<span>Длительность:</span>
												<span className='font-medium text-foreground'>
													{service.duration}
												</span>
											</div>
										</div>
										<div className='mt-3 pt-3 border-t border-border'>
											<div className='flex items-center justify-between text-xs'>
												<span className='text-muted-foreground'>
													Популярность
												</span>
												<span className='text-primary font-medium'>
													{Math.round((service.count / 112) * 100)}%
												</span>
											</div>
											<Progress
												value={(service.count / 112) * 100}
												className='h-1.5 mt-2'
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default StaffDetailPage
