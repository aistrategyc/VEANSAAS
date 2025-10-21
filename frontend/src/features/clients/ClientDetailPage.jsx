import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Calendar,
	Phone,
	Mail,
	MapPin,
	Star,
	Edit,
	MessageSquare,
	Gift,
	Clock,
	AlertCircle,
	Heart,
	Award,
	Sparkles,
	CheckCircle2,
	FileText,
	ShoppingCart,
	User,
	CreditCard,
	Send,
	Bell,
	Users,
	Wallet,
} from 'lucide-react'
import { Link, useParams, useRouteError, useSearchParams } from 'react-router'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useClient } from './hooks/useClients'
import { Loader } from '@/shared/ui/loader/Loader'

const clientDetails = {
	id: 'c1',
	name: 'Анна Петрова',
	phone: '+49 176 1234 5678',
	email: 'anna.petrova@email.com',
	avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
	birthDate: '1995-03-15',
	registeredDate: '2022-05-10',
	address: 'Friedrichstraße 45, 10117 Berlin',

	status: 'vip',
	loyaltyTier: 'Gold',
	loyaltyPoints: 450,
	loyaltyBalance: 45,

	paymentMethods: [
		{ type: 'card', label: 'Карта', preferred: true, lastUsed: '2023-12-10' },
		{
			type: 'cash',
			label: 'Наличные',
			preferred: false,
			lastUsed: '2023-10-15',
		},
		{ type: 'bonus', label: 'Бонусы', preferred: true, lastUsed: '2023-11-20' },
	],

	communications: [
		{
			id: 'comm1',
			type: 'reminder',
			date: '2024-01-14 10:00',
			channel: 'WhatsApp',
			message: 'Напоминание о записи завтра в 14:00',
			status: 'delivered',
			sentBy: 'Система',
		},
		{
			id: 'comm2',
			type: 'message',
			date: '2024-01-10 15:30',
			channel: 'Email',
			message: 'Подтверждение предоплаты €100',
			status: 'read',
			sentBy: 'Система',
		},
		{
			id: 'comm3',
			type: 'message',
			date: '2023-12-11 09:00',
			channel: 'SMS',
			message: 'Спасибо за визит! Оцените нашу работу',
			status: 'delivered',
			sentBy: 'Мария Иванова',
		},
		{
			id: 'comm4',
			type: 'reminder',
			date: '2023-12-09 18:00',
			channel: 'WhatsApp',
			message: 'Напоминание о записи завтра в 15:00',
			status: 'read',
			sentBy: 'Система',
		},
	],

	referrals: {
		totalReferred: 3,
		activeReferrals: 2,
		totalEarned: 60,
		referredClients: [
			{
				id: 'ref1',
				name: 'Елена Сидорова',
				joinDate: '2023-08-15',
				status: 'active',
				totalSpent: 320,
				bonus: 20,
			},
			{
				id: 'ref2',
				name: 'Ольга Кузнецова',
				joinDate: '2023-10-20',
				status: 'active',
				totalSpent: 180,
				bonus: 20,
			},
			{
				id: 'ref3',
				name: 'Мария Новикова',
				joinDate: '2023-06-10',
				status: 'inactive',
				totalSpent: 450,
				bonus: 20,
			},
		],
	},

	profileCompleteness: {
		total: 85,
		sections: [
			{ name: 'Контактная информация', completed: true, weight: 20 },
			{ name: 'Медицинская информация', completed: true, weight: 15 },
			{ name: 'Предпочтения', completed: true, weight: 15 },
			{ name: 'Фото профиля', completed: true, weight: 10 },
			{ name: 'Дата рождения', completed: true, weight: 10 },
			{ name: 'Адрес', completed: true, weight: 10 },
			{ name: 'Социальные сети', completed: false, weight: 10 },
			{ name: 'Экстренный контакт', completed: false, weight: 10 },
		],
	},

	agreements: [
		{
			id: 'a1',
			name: 'Согласие на обработку персональных данных',
			signedDate: '2022-05-10',
			status: 'signed',
			expiryDate: null,
		},
		{
			id: 'a2',
			name: 'Согласие на получение маркетинговых материалов',
			signedDate: '2022-05-10',
			status: 'signed',
			expiryDate: null,
		},
		{
			id: 'a3',
			name: 'Информированное согласие на татуировку',
			signedDate: '2023-10-05',
			status: 'signed',
			expiryDate: '2024-10-05',
		},
		{
			id: 'a4',
			name: 'Правила студии и политика отмены',
			signedDate: '2022-05-10',
			status: 'signed',
			expiryDate: null,
		},
	],

	carts: [
		{
			id: 'cart1',
			date: '2024-01-10',
			status: 'active',
			items: [
				{ name: 'Крем для ухода за татуировкой', price: 25, quantity: 1 },
				{ name: 'Защитная пленка (5 шт)', price: 15, quantity: 2 },
			],
			total: 55,
		},
	],

	statistics: {
		totalVisits: 12,
		totalSpent: 1450,
		averageCheck: 120.83,
		lastVisit: '2023-12-10',
		cancelledAppointments: 1,
		noShowAppointments: 0,
		satisfactionRate: 98,
	},

	preferences: {
		favoriteServices: ['Художественная татуировка', 'Коррекция татуировки'],
		favoriteMasters: ['Мария Иванова', 'Алексей Смирнов'],
		preferredTime: 'После обеда (14:00-18:00)',
		communication: ['Email', 'WhatsApp'],
		music: 'Тихая музыка',
		drinks: 'Зеленый чай',
		temperature: 'Теплое помещение',
	},

	health: {
		allergies: ['Латекс'],
		conditions: [],
		medications: [],
		notes: 'Чувствительная кожа, требуется дополнительное время на заживление',
	},

	appointments: [
		{
			id: '1',
			date: '2024-01-15',
			time: '14:00',
			service: 'Художественная татуировка',
			master: 'Мария Иванова',
			status: 'confirmed',
			price: 225,
			duration: 120,
		},
		{
			id: '2',
			date: '2023-12-10',
			time: '15:00',
			service: 'Художественная татуировка',
			master: 'Мария Иванова',
			status: 'completed',
			price: 250,
			duration: 90,
			rating: 5,
			review: 'Отличная работа! Очень довольна результатом.',
		},
		{
			id: '3',
			date: '2023-10-05',
			time: '16:00',
			service: 'Консультация',
			master: 'Мария Иванова',
			status: 'completed',
			price: 0,
			duration: 30,
		},
	],

	purchases: [
		{
			id: 'p1',
			date: '2023-12-10',
			items: ['Крем для ухода за татуировкой', 'Защитная пленка'],
			total: 45,
			paymentMethod: 'Карта',
		},
		{
			id: 'p2',
			date: '2023-10-15',
			items: ['Набор для ухода'],
			total: 35,
			paymentMethod: 'Наличные',
		},
	],

	notes: [
		{
			id: 'n1',
			date: '2023-12-10',
			author: 'Мария Иванова',
			text: 'Клиент очень довольна результатом первого сеанса. Обсудили детали следующего сеанса.',
			type: 'general',
		},
		{
			id: 'n2',
			date: '2023-10-05',
			author: 'Мария Иванова',
			text: 'Первая консультация. Клиент хочет минималистичную татуировку на предплечье. Обсудили эскиз.',
			type: 'consultation',
		},
	],

	loyaltyHistory: [
		{
			date: '2023-12-10',
			action: 'Начислено 25 баллов',
			points: 25,
			balance: 450,
		},
		{
			date: '2023-11-20',
			action: 'Использовано 50 баллов',
			points: -50,
			balance: 425,
		},
		{
			date: '2023-10-15',
			action: 'Начислено 35 баллов',
			points: 35,
			balance: 475,
		},
	],
}

const ClientDetailPage = () => {
	const { uuid } = useParams()
	const [client] = useState(clientDetails)

	const { clientData, getClientInfo, isLoading } = useClient()

	useEffect(() => {
		getClientInfo(uuid)
	}, [])

	const getStatusColor = status => {
		switch (status) {
			case 'confirmed':
				return 'bg-green-500/20 text-green-400'
			case 'completed':
				return 'bg-blue-500/20 text-blue-400'
			case 'cancelled':
				return 'bg-red-500/20 text-red-400'
			default:
				return 'bg-gray-500/20 text-gray-400'
		}
	}

	const getTierColor = tier => {
		switch (tier) {
			case 'Platinum':
				return 'bg-primary/20 text-primary'
			case 'Gold':
				return 'bg-amber-500/20 text-amber-600'
			case 'Silver':
				return 'bg-gray-400/20 text-gray-600'
			default:
				return 'bg-blue-500/20 text-blue-600'
		}
	}
	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='min-h-screen bg-background'>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Заголовок */}
				<div className='flex items-center justify-between'>
					<div>
						<Button
							variant='ghost'
							className='mb-4 text-muted-foreground hover:text-foreground'
						>
							<Link to='/clients'>Назад к клиентам</Link>
						</Button>
						<div className='flex items-center gap-4'>
							<div className='relative'>
								<Avatar className='h-20 w-20 border-2 border-primary'>
									<AvatarImage
										src={client.avatar || '/placeholder.svg'}
										alt={client.name}
									/>
								</Avatar>
								<div className='absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-background' />
							</div>
							<div>
								<h1 className='text-3xl font-bold text-foreground'>
									{clientData.first_name} {clientData.last_name}
								</h1>
								<div className='flex items-center gap-3 mt-2'>
									<Badge className={getTierColor(client.loyaltyTier)}>
										<Award className='w-3 h-3 mr-1' />
										{client.loyaltyTier}
									</Badge>
									{client.status === 'vip' && (
										<Badge className='bg-purple-500/20 text-purple-600'>
											<Sparkles className='w-3 h-3 mr-1' />
											VIP
										</Badge>
									)}
									<span className='text-muted-foreground text-sm'>
										Клиент с {client.registeredDate}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='flex gap-3'>
						<Button
							variant='outline'
							className='border-amber-200 text-amber-600 hover:bg-amber-50'
						>
							<Bell className='w-4 h-4 mr-2' />
							Напомнить о визите
						</Button>
						<Button
							variant='outline'
							className='border-border text-muted-foreground hover:bg-accent'
						>
							<MessageSquare className='w-4 h-4 mr-2' />
							Сообщение
						</Button>
						<Button className='bg-primary hover:bg-primary/90'>
							<Calendar className='w-4 h-4 mr-2' />
							Новая запись
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Левая колонка */}
					<div className='space-y-6'>
						<Card className='crypto-card'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-lg font-semibold text-card-foreground'>
										Общая сумма
									</h3>
									<Wallet className='w-5 h-5 text-primary' />
								</div>
								<p className='text-4xl font-bold text-card-foreground mb-1'>
									€{client.statistics.totalSpent}
								</p>
								<p className='text-sm text-muted-foreground'>За все время</p>
								<Separator className='my-4' />
								<div className='flex items-center justify-between text-sm'>
									<span className='text-card-foreground'>Средний чек</span>
									<span className='text-card-foreground font-semibold'>
										€{client.statistics.averageCheck}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card className='crypto-card'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-lg font-semibold text-card-foreground'>
										Наполненность профиля
									</h3>
									<User className='w-5 h-5 text-primary' />
								</div>
								<div className='text-center mb-4'>
									<p className='text-4xl font-bold text-card-foreground mb-1'>
										{client.profileCompleteness.total}%
									</p>
									<div className='w-full bg-muted rounded-full h-3 mb-4'>
										<div
											className='h-full bg-primary rounded-full transition-all duration-500'
											style={{ width: `${client.profileCompleteness.total}%` }}
										/>
									</div>
								</div>
								<div className='space-y-2'>
									{client.profileCompleteness.sections.map((section, idx) => (
										<div
											key={idx}
											className='flex items-center justify-between text-sm'
										>
											<div className='flex items-center gap-2'>
												{section.completed ? (
													<CheckCircle2 className='w-4 h-4 text-green-500' />
												) : (
													<div className='w-4 h-4 rounded-full border-2 border-muted-foreground/30' />
												)}
												<span
													className={
														section.completed
															? 'text-card-foreground'
															: 'text-muted-foreground'
													}
												>
													{section.name}
												</span>
											</div>
											<span className='text-muted-foreground'>
												{section.weight}%
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className='crypto-card'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-lg font-semibold text-card-foreground'>
										Методы оплаты
									</h3>
									<CreditCard className='w-5 h-5 text-primary' />
								</div>
								<div className='space-y-3'>
									{client.paymentMethods.map((method, idx) => (
										<div
											key={idx}
											className={`p-3 rounded-lg border transition-all ${
												method.preferred
													? 'bg-primary/10 border-primary/30'
													: 'bg-muted/50 border-border'
											}`}
										>
											<div className='flex items-center justify-between mb-1'>
												<div className='flex items-center gap-2'>
													{method.type === 'card' && (
														<CreditCard className='w-4 h-4 text-primary' />
													)}
													{method.type === 'cash' && (
														<Wallet className='w-4 h-4 text-green-500' />
													)}
													{method.type === 'bonus' && (
														<Star className='w-4 h-4 text-amber-500' />
													)}
													<span className='text-card-foreground font-medium'>
														{method.label}
													</span>
												</div>
												{method.preferred && (
													<Badge className='bg-primary/20 text-primary text-xs'>
														Предпочитаемый
													</Badge>
												)}
											</div>
											<p className='text-xs text-muted-foreground'>
												Последнее использование: {method.lastUsed}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Контактная информация */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle className='text-lg'>Контактная информация</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div className='flex items-center gap-3 text-card-foreground'>
									<Phone className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm'>{clientData.phone_number}</span>
								</div>
								<div className='flex items-center gap-3 text-card-foreground'>
									<Mail className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm'>{clientData.email}</span>
								</div>
								<div className='flex items-start gap-3 text-card-foreground'>
									<MapPin className='w-4 h-4 text-muted-foreground mt-0.5' />
									<span className='text-sm'>{client.address}</span>
								</div>
								<div className='flex items-center gap-3 text-card-foreground'>
									<Calendar className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm'>
										Дата рождения: {client.birthDate}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Статистика */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle className='text-lg'>Статистика</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-card-foreground'>Всего визитов</span>
									<span className='text-card-foreground font-semibold text-lg'>
										{client.statistics.totalVisits}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-card-foreground'>Потрачено</span>
									<span className='text-card-foreground font-semibold text-lg'>
										€{client.statistics.totalSpent}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-card-foreground'>Средний чек</span>
									<span className='text-card-foreground font-semibold'>
										€{client.statistics.averageCheck}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-card-foreground'>Последний визит</span>
									<span className='text-card-foreground font-medium'>
										{client.statistics.lastVisit}
									</span>
								</div>
								<Separator />
								<div className='flex items-center justify-between mb-2'>
									<span className='text-card-foreground'>
										Удовлетворенность
									</span>
									<span className='text-green-500 font-semibold'>
										{client.statistics.satisfactionRate}%
									</span>
								</div>
								<div className='w-full bg-muted rounded-full h-2'>
									<div
										className='h-full bg-green-500 rounded-full'
										style={{
											width: `${client.statistics.satisfactionRate}%`,
										}}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Программа лояльности */}
						<Card className='crypto-card'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-lg font-semibold text-card-foreground'>
										Программа лояльности
									</h3>
									<Gift className='w-5 h-5 text-primary' />
								</div>
								<div className='space-y-4'>
									<div className='text-center'>
										<p className='text-4xl font-bold text-card-foreground mb-1'>
											{client.loyaltyPoints}
										</p>
										<p className='text-sm text-muted-foreground'>
											Бонусных баллов
										</p>
									</div>
									<Separator />
									<div className='text-center'>
										<p className='text-2xl font-bold text-amber-500 mb-1'>
											€{client.loyaltyBalance}
										</p>
										<p className='text-sm text-muted-foreground'>
											Баланс лояльности
										</p>
									</div>
								</div>
								<Button className='w-full mt-4 bg-primary hover:bg-primary/90'>
									<Gift className='w-4 h-4 mr-2' />
									Использовать баллы
								</Button>
							</CardContent>
						</Card>

						{/* Здоровье */}
						{(client.health.allergies.length > 0 || client.health.notes) && (
							<Card className='crypto-card'>
								<CardContent className='pt-6'>
									<div className='flex items-center gap-2 mb-4'>
										<AlertCircle className='w-5 h-5 text-red-500' />
										<h3 className='text-lg font-semibold text-card-foreground'>
											Медицинская информация
										</h3>
									</div>
									{client.health.allergies.length > 0 && (
										<div className='mb-3'>
											<p className='text-xs text-red-500 font-semibold mb-1'>
												Аллергии
											</p>
											<div className='flex flex-wrap gap-2'>
												{client.health.allergies.map((allergy, idx) => (
													<Badge
														key={idx}
														className='bg-red-500/20 text-red-600 border-red-200'
													>
														{allergy}
													</Badge>
												))}
											</div>
										</div>
									)}
									{client.health.notes && (
										<div>
											<p className='text-xs text-red-500 font-semibold mb-1'>
												Заметки
											</p>
											<p className='text-sm text-card-foreground'>
												{client.health.notes}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</div>

					{/* Правая колонка */}
					<div className='lg:col-span-2'>
						<Tabs defaultValue='appointments' className='space-y-6'>
							<ScrollArea className='w-full whitespace-nowrap'>
								<TabsList className='w-full bg-background border inline-flex min-w-max'>
									<TabsTrigger value='appointments'>
										История записей
									</TabsTrigger>
									<TabsTrigger value='communications'>Коммуникации</TabsTrigger>
									<TabsTrigger value='referrals'>Рефералы</TabsTrigger>
									<TabsTrigger value='preferences'>Предпочтения</TabsTrigger>
									<TabsTrigger value='purchases'>Покупки</TabsTrigger>
									<TabsTrigger value='agreements'>Соглашения</TabsTrigger>
									<TabsTrigger value='carts'>Корзины</TabsTrigger>
									<TabsTrigger value='notes'>Заметки</TabsTrigger>
								</TabsList>
								<ScrollBar orientation='horizontal' />
							</ScrollArea>
							<TabsContent value='appointments' className='space-y-4'>
								{client.appointments.map(appointment => (
									<Card
										key={appointment.id}
										className='crypto-card hover:border-primary/50 transition-all'
									>
										<CardContent className='pt-6'>
											<div className='flex items-start justify-between mb-4'>
												<div className='flex items-start gap-4'>
													<div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
														<Calendar className='w-6 h-6 text-primary' />
													</div>
													<div>
														<h4 className='text-card-foreground font-semibold mb-1'>
															{appointment.service}
														</h4>
														<p className='text-sm text-muted-foreground'>
															Мастер: {appointment.master}
														</p>
														<div className='flex items-center gap-3 mt-2 text-sm text-muted-foreground'>
															<span className='flex items-center gap-1'>
																<Calendar className='w-3 h-3' />
																{appointment.date}
															</span>
															<span className='flex items-center gap-1'>
																<Clock className='w-3 h-3' />
																{appointment.time}
															</span>
															<span>{appointment.duration} мин</span>
														</div>
													</div>
												</div>
												<div className='text-right'>
													<Badge className={getStatusColor(appointment.status)}>
														{appointment.status === 'completed' && 'Завершена'}
														{appointment.status === 'confirmed' &&
															'Подтверждена'}
														{appointment.status === 'cancelled' && 'Отменена'}
													</Badge>
													<p className='text-card-foreground font-semibold mt-2'>
														€{appointment.price}
													</p>
												</div>
											</div>
											{appointment.rating && (
												<>
													<Separator className='mb-4' />
													<div className='flex items-center gap-2 mb-2'>
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`w-4 h-4 ${
																	i < appointment.rating
																		? 'text-yellow-500 fill-yellow-500'
																		: 'text-muted-foreground'
																}`}
															/>
														))}
													</div>
													{appointment.review && (
														<p className='text-sm text-card-foreground'>
															{appointment.review}
														</p>
													)}
												</>
											)}
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent value='communications' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<CardTitle>История сообщений</CardTitle>
											<Button className='bg-primary hover:bg-primary/90'>
												<Send className='w-4 h-4 mr-2' />
												Отправить сообщение
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											{client.communications.map(comm => (
												<div
													key={comm.id}
													className='flex items-start gap-4 p-4 rounded-lg bg-muted/50 border hover:border-primary/50 transition-all'
												>
													<div
														className={`w-10 h-10 rounded-lg flex items-center justify-center ${
															comm.type === 'reminder'
																? 'bg-amber-500/20'
																: comm.channel === 'WhatsApp'
																? 'bg-green-500/20'
																: comm.channel === 'Email'
																? 'bg-blue-500/20'
																: 'bg-purple-500/20'
														}`}
													>
														{comm.type === 'reminder' ? (
															<Bell className='w-5 h-5 text-amber-500' />
														) : (
															<MessageSquare
																className={`w-5 h-5 ${
																	comm.channel === 'WhatsApp'
																		? 'text-green-500'
																		: comm.channel === 'Email'
																		? 'text-blue-500'
																		: 'text-purple-500'
																}`}
															/>
														)}
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between mb-2'>
															<div className='flex items-center gap-2'>
																<Badge
																	className={
																		comm.type === 'reminder'
																			? 'bg-amber-500/20 text-amber-600'
																			: 'bg-primary/20 text-primary'
																	}
																>
																	{comm.type === 'reminder'
																		? 'Напоминание'
																		: 'Сообщение'}
																</Badge>
																<Badge variant='outline' className='text-xs'>
																	{comm.channel}
																</Badge>
															</div>
															<Badge
																className={
																	comm.status === 'read'
																		? 'bg-green-500/20 text-green-600'
																		: 'bg-blue-500/20 text-blue-600'
																}
															>
																{comm.status === 'read'
																	? 'Прочитано'
																	: 'Доставлено'}
															</Badge>
														</div>
														<p className='text-card-foreground text-sm mb-2'>
															{comm.message}
														</p>
														<div className='flex items-center gap-3 text-xs text-muted-foreground'>
															<span>{comm.date}</span>
															<span>•</span>
															<span>Отправитель: {comm.sentBy}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value='referrals' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												<div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
													<Users className='w-6 h-6 text-primary' />
												</div>
												<div>
													<CardTitle>Реферальная программа</CardTitle>
													<p className='text-sm text-muted-foreground'>
														Приглашайте друзей и получайте бонусы
													</p>
												</div>
											</div>
											<Button className='bg-primary hover:bg-primary/90'>
												<Users className='w-4 h-4 mr-2' />
												Пригласить друга
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className='grid grid-cols-3 gap-4 mb-6'>
											<div className='bg-muted/50 rounded-lg p-4 text-center'>
												<p className='text-3xl font-bold text-card-foreground mb-1'>
													{client.referrals.totalReferred}
												</p>
												<p className='text-xs text-muted-foreground'>
													Всего приглашено
												</p>
											</div>
											<div className='bg-muted/50 rounded-lg p-4 text-center'>
												<p className='text-3xl font-bold text-green-500 mb-1'>
													{client.referrals.activeReferrals}
												</p>
												<p className='text-xs text-muted-foreground'>
													Активных
												</p>
											</div>
											<div className='bg-muted/50 rounded-lg p-4 text-center'>
												<p className='text-3xl font-bold text-amber-500 mb-1'>
													€{client.referrals.totalEarned}
												</p>
												<p className='text-xs text-muted-foreground'>
													Заработано
												</p>
											</div>
										</div>

										<Separator className='mb-6' />

										<div className='space-y-3'>
											<h4 className='text-card-foreground font-semibold mb-3'>
												Приглашенные клиенты
											</h4>
											{client.referrals.referredClients.map(referral => (
												<div
													key={referral.id}
													className='flex items-center justify-between p-4 rounded-lg bg-muted/50 border hover:border-primary/50 transition-all'
												>
													<div className='flex items-center gap-3'>
														<Avatar className='w-10 h-10 border-2 border-green-500'>
															<AvatarImage
																src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${referral.name}`}
																alt={referral.name}
															/>
															<AvatarFallback className='text-xs'>
																{referral.name
																	.split(' ')
																	.map(n => n[0])
																	.join('')}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className='text-card-foreground font-medium'>
																{referral.name}
															</p>
															<p className='text-xs text-muted-foreground'>
																Присоединился: {referral.joinDate}
															</p>
														</div>
													</div>
													<div className='text-right'>
														<Badge
															className={
																referral.status === 'active'
																	? 'bg-green-500/20 text-green-600 mb-2'
																	: 'bg-muted text-muted-foreground mb-2'
															}
														>
															{referral.status === 'active'
																? 'Активен'
																: 'Неактивен'}
														</Badge>
														<p className='text-sm text-muted-foreground'>
															Потрачено: €{referral.totalSpent}
														</p>
														<p className='text-sm text-green-500 font-semibold'>
															Бонус: €{referral.bonus}
														</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value='preferences'>
								<Card className='crypto-card'>
									<CardContent className='pt-6'>
										<div className='space-y-6'>
											<div>
												<h4 className='text-card-foreground font-semibold mb-3'>
													Любимые услуги
												</h4>
												<div className='flex flex-wrap gap-2'>
													{client.preferences.favoriteServices.map(
														(service, idx) => (
															<Badge
																key={idx}
																className='bg-primary/20 text-primary border-primary/30'
															>
																<Heart className='w-3 h-3 mr-1' />
																{service}
															</Badge>
														)
													)}
												</div>
											</div>
											<div>
												<h4 className='text-card-foreground font-semibold mb-3'>
													Любимые мастера
												</h4>
												<div className='flex flex-wrap gap-2'>
													{client.preferences.favoriteMasters.map(
														(master, idx) => (
															<Badge
																key={idx}
																className='bg-purple-500/20 text-purple-600 border-purple-500/30'
															>
																<Star className='w-3 h-3 mr-1' />
																{master}
															</Badge>
														)
													)}
												</div>
											</div>
											<Separator />
											<div className='grid grid-cols-2 gap-4'>
												<div>
													<p className='text-xs text-muted-foreground mb-1'>
														Предпочитаемое время
													</p>
													<p className='text-sm text-card-foreground'>
														{client.preferences.preferredTime}
													</p>
												</div>
												<div>
													<p className='text-xs text-muted-foreground mb-1'>
														Музыка
													</p>
													<p className='text-sm text-card-foreground'>
														{client.preferences.music}
													</p>
												</div>
												<div>
													<p className='text-xs text-muted-foreground mb-1'>
														Напитки
													</p>
													<p className='text-sm text-card-foreground'>
														{client.preferences.drinks}
													</p>
												</div>
												<div>
													<p className='text-xs text-muted-foreground mb-1'>
														Температура
													</p>
													<p className='text-sm text-card-foreground'>
														{client.preferences.temperature}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value='purchases' className='space-y-4'>
								{client.purchases.map(purchase => (
									<Card key={purchase.id} className='crypto-card'>
										<CardContent className='pt-6'>
											<div className='flex items-start justify-between'>
												<div>
													<p className='text-sm text-muted-foreground mb-2'>
														{purchase.date}
													</p>
													<ul className='space-y-1'>
														{purchase.items.map((item, idx) => (
															<li
																key={idx}
																className='text-card-foreground text-sm'
															>
																• {item}
															</li>
														))}
													</ul>
													<p className='text-xs text-muted-foreground mt-2'>
														Оплата: {purchase.paymentMethod}
													</p>
												</div>
												<p className='text-card-foreground font-semibold text-lg'>
													€{purchase.total}
												</p>
											</div>
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent value='agreements' className='space-y-4'>
								<Card className='crypto-card'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<CardTitle>Подписанные соглашения</CardTitle>
											<Badge className='bg-green-500/20 text-green-600'>
												{
													client.agreements.filter(a => a.status === 'signed')
														.length
												}{' '}
												из {client.agreements.length}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											{client.agreements.map(agreement => (
												<div
													key={agreement.id}
													className='flex items-start justify-between p-4 rounded-lg bg-muted/50 border hover:border-primary/50 transition-all'
												>
													<div className='flex items-start gap-3'>
														<div className='w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center'>
															<FileText className='w-5 h-5 text-green-500' />
														</div>
														<div>
															<h4 className='text-card-foreground font-medium mb-1'>
																{agreement.name}
															</h4>
															<div className='flex items-center gap-4 text-sm text-muted-foreground'>
																<span>Подписано: {agreement.signedDate}</span>
																{agreement.expiryDate && (
																	<span>
																		Действует до: {agreement.expiryDate}
																	</span>
																)}
															</div>
														</div>
													</div>
													<Badge className='bg-green-500/20 text-green-600 border-green-500/30'>
														<CheckCircle2 className='w-3 h-3 mr-1' />
														Подписано
													</Badge>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value='carts' className='space-y-4'>
								{client.carts.map(cart => (
									<Card key={cart.id} className='crypto-card'>
										<CardContent className='pt-6'>
											<div className='flex items-center justify-between mb-4'>
												<div className='flex items-center gap-3'>
													<div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
														<ShoppingCart className='w-6 h-6 text-primary' />
													</div>
													<div>
														<h4 className='text-card-foreground font-semibold'>
															Корзина от {cart.date}
														</h4>
														<Badge
															className={
																cart.status === 'active'
																	? 'bg-green-500/20 text-green-600'
																	: 'bg-muted text-muted-foreground'
															}
														>
															{cart.status === 'active'
																? 'Активна'
																: 'Завершена'}
														</Badge>
													</div>
												</div>
												<p className='text-2xl font-bold text-card-foreground'>
													€{cart.total}
												</p>
											</div>
											<Separator className='mb-4' />
											<div className='space-y-3'>
												{cart.items.map((item, idx) => (
													<div
														key={idx}
														className='flex items-center justify-between'
													>
														<div>
															<p className='text-card-foreground text-sm'>
																{item.name}
															</p>
															<p className='text-xs text-muted-foreground'>
																Количество: {item.quantity}
															</p>
														</div>
														<p className='text-card-foreground font-medium'>
															€{item.price * item.quantity}
														</p>
													</div>
												))}
											</div>
											{cart.status === 'active' && (
												<div className='flex gap-2 mt-4'>
													<Button className='flex-1 bg-primary hover:bg-primary/90'>
														<CreditCard className='w-4 h-4 mr-2' />
														Оформить заказ
													</Button>
													<Button
														variant='outline'
														className='border-border text-muted-foreground hover:bg-accent'
													>
														<Edit className='w-4 h-4' />
													</Button>
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</TabsContent>

							<TabsContent value='notes' className='space-y-4'>
								{client.notes.map(note => (
									<Card key={note.id} className='crypto-card'>
										<CardContent className='pt-6'>
											<div className='flex items-start justify-between mb-3'>
												<div>
													<p className='text-card-foreground font-medium'>
														{note.author}
													</p>
													<p className='text-xs text-muted-foreground'>
														{note.date}
													</p>
												</div>
												<Badge className='bg-primary/20 text-primary'>
													{note.type === 'general' && 'Общее'}
													{note.type === 'consultation' && 'Консультация'}
												</Badge>
											</div>
											<p className='text-card-foreground text-sm'>
												{note.text}
											</p>
										</CardContent>
									</Card>
								))}
								<Button
									variant='outline'
									className='w-full border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
								>
									<Edit className='w-4 h-4 mr-2' />
									Добавить заметку
								</Button>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ClientDetailPage
