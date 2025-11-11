import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
	Calendar,
	Clock,
	Phone,
	Mail,
	MapPin,
	Euro,
	CheckCircle2,
	XCircle,
	AlertCircle,
	FileText,
	Edit,
	MessageSquare,
	Camera,
	Download,
	CreditCard,
	Wallet,
	Receipt,
	Star,
	History,
	ImageIcon,
	Layers,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAppointment } from './hooks/useAppointment'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import api from '@/shared/api/client'
import toast from 'react-hot-toast'

const appointmentDetails = {
	id: '1',
	status: 'confirmed',
	date: '2024-01-15',
	time: '14:00',
	duration: 120,
	checkedIn: false,
	checkedInAt: null,

	sessionInfo: {
		currentSession: 2,
		totalSessions: 3,
		progress: 60,
		previousSessions: [
			{ date: '2023-12-10', duration: 90, notes: 'Первый сеанс - контур' },
		],
		nextSessionPlanned: '2024-02-20',
	},

	client: {
		id: 'c1',
		name: 'Анна Петрова',
		phone: '+49 176 1234 5678',
		email: 'anna.petrova@email.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
		birthDate: '1995-03-15',
		totalVisits: 12,
		totalSpent: 1450,
		lastVisit: '2023-12-10',
		notes: 'Предпочитает минималистичный стиль, чувствительная кожа',
		allergies: 'Латекс',
		preferences: ['Тихая музыка', 'Зеленый чай', 'Теплое помещение'],
	},

	master: {
		id: 'm1',
		name: 'Мария Иванова',
		phone: '+49 176 9876 5432',
		email: 'maria.ivanova@studio.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
		specialization: 'Тату-мастер',
		experience: '8 лет',
		rating: 4.9,
		completedSessions: 450,
	},

	service: {
		id: 's1',
		name: 'Художественная татуировка',
		category: 'Татуировки',
		type: 'tattoo',
		description: 'Создание уникального дизайна татуировки в стиле минимализм',
		style: 'Минимализм',
		size: 'Средний (10x15 см)',
		placement: 'Предплечье',
		color: 'Черно-белая',
		complexity: 'Средняя',

		tattooDetails: {
			technique: 'Лайнворк + Дотворк',
			needleSize: '5RL, 7RS',
			inkBrand: 'Eternal Ink',
			healingTime: '2-3 недели',
			touchUpIncluded: true,
		},
	},

	studio: {
		id: 'st1',
		name: 'Beauty Studio Central',
		address: 'Hauptstraße 123, 10115 Berlin',
		room: 'Кабинет №3',
	},

	pricing: {
		basePrice: 250,
		discount: 25,
		finalPrice: 225,
		prepaid: 100,
		remaining: 125,
		currency: 'EUR',
		paymentMethods: [
			{ type: 'card', amount: 60, label: 'Карта', icon: 'CreditCard' },
			{ type: 'cash', amount: 40, label: 'Наличные', icon: 'Wallet' },
			{ type: 'bonus', amount: 25, label: 'Бонусы', icon: 'Star' },
		],
		availableBonus: 450,
		bonusRate: 1,
		prepaidAt: '2024-01-10 15:30',
	},

	agreements: {
		serviceConsent: false,
		healthDeclaration: false,
		photoConsent: false,
		cancellationPolicy: false,
		dataProcessing: false,
	},

	notes:
		'Клиент хочет татуировку с изображением горного пейзажа в минималистичном стиле',

	history: [
		{
			date: '2024-01-10 15:30',
			action: 'Запись создана',
			user: 'Администратор',
		},
		{
			date: '2024-01-10 15:35',
			action: 'Предоплата получена (€100)',
			user: 'Система',
		},
		{
			date: '2024-01-12 10:20',
			action: 'Подтверждение отправлено клиенту',
			user: 'Система',
		},
	],

	attachments: [
		{
			id: 1,
			name: 'Эскиз дизайна.jpg',
			type: 'sketch',
			size: '2.4 MB',
			url: 'https://toptattoo.ru/photos/2021/07/CDyydC9lKWr.jpg',
			isMain: true,
		},
		{
			id: 2,
			name: 'Референс 1.jpg',
			type: 'reference',
			size: '1.2 MB',
			url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=400&fit=crop',
		},
		{
			id: 3,
			name: 'Референс 2.jpg',
			type: 'reference',
			size: '1.5 MB',
			url: 'http://i.pinimg.com/236x/69/58/7c/69587c9ddcde419ffa17e5a888669f86.jpg',
		},
		{
			id: 4,
			name: 'Согласие клиента.pdf',
			type: 'document',
			size: '0.8 MB',
		},
	],

	marketing: {
		promotion: {
			name: 'Летняя акция 2024',
			description: 'Скидка 10% на все услуги татуировки',
			discount: 25,
			validUntil: '2024-08-31',
			code: 'SUMMER2024',
		},
		loyaltyProgram: {
			tier: 'Gold',
			points: 450,
			pointsToNextTier: 50,
			nextTier: 'Platinum',
			cashback: 5,
			benefits: ['Приоритетная запись', 'Скидка 10%', 'Бесплатный кофе'],
		},
		referralBonus: {
			active: true,
			amount: 20,
			referredClients: 3,
		},
		specialOffer: {
			type: 'Многосеансовая скидка',
			description: 'При оплате всех 3 сеансов сразу - скидка 15%',
			savings: 112.5,
		},
	},
}

export default function AppointmentDetailPage() {
	const [appointment, setAppointment] = useState(appointmentDetails)
	const [notes, setNotes] = useState(appointment.notes)
	const [isEditing, setIsEditing] = useState(false)
	const [selectedImage, setSelectedImage] = useState()
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
	const [status, setStatus] = useState(appointment.status)
	const [loading, setLoading] = useState(false)

	const { uuid } = useParams()
	const navigate = useNavigate()

	const { appointmentData, getAppointmentInfo } = useAppointment()

	useEffect(() => {
		getAppointmentInfo(uuid)
	}, [])

	const handleStatusChange = async newStatus => {
		try {
			setLoading(true)
			setStatus(newStatus)

			api
				.post(`/appointments/${uuid}/status`, { status: newStatus })
				.then(toast.success('Статус успешно обновлён'))
				.catch(err => {})
		} finally {
			setLoading(false)
		}
	}
	const statusOptions = [
		{ value: 'scheduled', label: 'Запланирован' },
		{ value: 'confirmed', label: 'Подтверждён' },
		{ value: 'in_progress', label: 'В процессе' },
		{ value: 'completed', label: 'Завершён' },
		{ value: 'cancelled', label: 'Отменён' },
	]

	return (
		<div className='min-h-screen bg-background p-6'>
			<div className=' mx-auto space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<Button
							variant='ghost'
							className='mb-4 text-muted-foreground hover:text-foreground'
							onClick={() => navigate(-1)}
						>Назад</Button>
						<h1 className='text-3xl font-bold text-foreground'>
							Запись #{appointmentData.uuid}
						</h1>
						<p className='text-muted-foreground mt-1'>
							{appointment.date} в {appointment.time}
						</p>
					</div>

					<div className='flex items-center gap-3'>
						<Select
							disabled={loading}
							value={status}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger className='w-[200px]'>
								<SelectValue placeholder='Выберите статус' />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Левая колонка - Основная информация */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Маркетинг и акции */}
						{/* {appointment.marketing && (
							<Card className='crypto-card'>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
												<Star className='w-5 h-5 text-primary' />
											</div>
											<div>
												<CardTitle>Маркетинг и акции</CardTitle>
												<p className='text-sm text-muted-foreground'>
													Активные предложения для этой записи
												</p>
											</div>
										</div>
										<Badge className='bg-amber-500/20 text-amber-600 border-amber-500/30 px-3 py-1'>
											Экономия €{appointment.pricing.discount}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'> */}
						{/* Активная акция */}
						{/* {appointment.marketing.promotion && (
											<div className='bg-muted/50 border rounded-lg p-4'>
												<div className='flex items-start justify-between mb-2'>
													<Badge className='bg-amber-500 text-white'>
														Акция
													</Badge>
													<span className='text-xs text-amber-600'>
														до {appointment.marketing.promotion.validUntil}
													</span>
												</div>
												<h4 className='text-card-foreground font-semibold mb-1'>
													{appointment.marketing.promotion.name}
												</h4>
												<p className='text-sm text-muted-foreground mb-3'>
													{appointment.marketing.promotion.description}
												</p>
												<div className='flex items-center justify-between'>
													<span className='text-xs text-muted-foreground'>
														Промокод:
													</span>
													<code className='bg-background px-2 py-1 rounded text-amber-600 text-sm font-mono'>
														{appointment.marketing.promotion.code}
													</code>
												</div>
											</div>
										)} */}

						{/* Программа лояльности */}
						{/* {appointment.marketing.loyaltyProgram && (
											<div className='bg-muted/50 border rounded-lg p-4'>
												<div className='flex items-center justify-between mb-2'>
													<Badge className='bg-purple-500 text-white'>
														{appointment.marketing.loyaltyProgram.tier}
													</Badge>
													<span className='text-xs text-purple-600'>
														{appointment.marketing.loyaltyProgram.cashback}%
														кэшбэк
													</span>
												</div>
												<h4 className='text-card-foreground font-semibold mb-1'>
													Программа лояльности
												</h4>
												<div className='mb-3'>
													<div className='flex items-center justify-between text-sm mb-1'>
														<span className='text-muted-foreground'>Баллы</span>
														<span className='text-card-foreground font-medium'>
															{appointment.marketing.loyaltyProgram.points}
														</span>
													</div>
													<div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
														<div
															className='h-full bg-primary rounded-full'
															style={{
																width: `${
																	(appointment.marketing.loyaltyProgram.points /
																		(appointment.marketing.loyaltyProgram
																			.points +
																			appointment.marketing.loyaltyProgram
																				.pointsToNextTier)) *
																	100
																}%`,
															}}
														/>
													</div>
													<p className='text-xs text-muted-foreground mt-1'>
														Еще{' '}
														{
															appointment.marketing.loyaltyProgram
																.pointsToNextTier
														}{' '}
														до {appointment.marketing.loyaltyProgram.nextTier}
													</p>
												</div>
												<div className='flex flex-wrap gap-1'>
													{appointment.marketing.loyaltyProgram.benefits
														.slice(0, 2)
														.map((benefit, idx) => (
															<Badge
																key={idx}
																className='bg-primary/20 text-primary text-xs'
															>
																{benefit}
															</Badge>
														))}
												</div>
											</div>
										)} */}

						{/* Реферальная программа
										{appointment.marketing.referralBonus &&
											appointment.marketing.referralBonus.active && (
												<div className='bg-muted/50 border rounded-lg p-4'>
													<Badge className='bg-green-500 text-white mb-2'>
														Реферальная программа
													</Badge>
													<h4 className='text-card-foreground font-semibold mb-1'>
														Бонус за друзей
													</h4>
													<p className='text-sm text-muted-foreground mb-2'>
														Приведи друга и получи €
														{appointment.marketing.referralBonus.amount}
													</p>
													<div className='flex items-center gap-2 text-sm'>
														<span className='text-muted-foreground'>
															Приглашено:
														</span>
														<span className='text-green-600 font-semibold'>
															{
																appointment.marketing.referralBonus
																	.referredClients
															}{' '}
															клиентов
														</span>
													</div>
												</div>
											)} */}

						{/* Специальное предложение */}
						{/* {appointment.marketing.specialOffer && (
											<div className='bg-muted/50 border rounded-lg p-4'>
												<Badge className='bg-blue-500 text-white mb-2'>
													{appointment.marketing.specialOffer.type}
												</Badge>
												<h4 className='text-card-foreground font-semibold mb-1'>
													Специальное предложение
												</h4>
												<p className='text-sm text-muted-foreground mb-2'>
													{appointment.marketing.specialOffer.description}
												</p>
												<div className='flex items-center gap-2'>
													<span className='text-xs text-muted-foreground'>
														Экономия:
													</span>
													<span className='text-blue-600 font-semibold text-lg'>
														€{appointment.marketing.specialOffer.savings}
													</span>
												</div>
											</div>
										)} */}
						{/* </div>

									{/* Заметки для мастера */}
						{/* <div className='mt-4 p-3 bg-muted/50 rounded-lg border'>
										<p className='text-xs text-muted-foreground mb-1'>
											💡 Заметка для мастера:
										</p>
										<p className='text-sm text-card-foreground'>
											Клиент хочет татуировку с изображением горного пейзажа в
											минималистичном стиле
										</p>
									</div>
								</CardContent>
							</Card>
						)}   */}

						{/* Информация о сеансе */}
						{appointment.sessionInfo && (
							<Card className='crypto-card'>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle>Информация о сеансе</CardTitle>
											<p className='text-sm text-muted-foreground mt-1'>
												Сеанс {appointment.sessionInfo.currentSession} из{' '}
												{appointment.sessionInfo.totalSessions}
											</p>
										</div>
										<Badge className='bg-primary/20 text-primary border-primary/30 px-4 py-2'>
											<Layers className='w-4 h-4 mr-2' />
											Многосеансовая работа
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									{/* Прогресс-бар */}
									<div className='mb-6'>
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm text-card-foreground'>
												Прогресс выполнения
											</span>
											<span className='text-sm font-semibold text-card-foreground'>
												{appointment.sessionInfo.progress}%
											</span>
										</div>
										<div className='w-full bg-muted rounded-full h-3 overflow-hidden'>
											<div
												className='h-full bg-primary rounded-full transition-all duration-500'
												style={{
													width: `${appointment.sessionInfo.progress}%`,
												}}
											/>
										</div>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										{/* Предыдущие сеансы */}
										<div className='bg-muted/50 rounded-lg p-4'>
											<p className='text-xs text-muted-foreground mb-2'>
												Предыдущие сеансы
											</p>
											{appointment.sessionInfo.previousSessions.map(
												(session, idx) => (
													<div key={idx} className='mb-2'>
														<p className='text-sm text-card-foreground font-medium'>
															{session.date}
														</p>
														<p className='text-xs text-muted-foreground'>
															{session.duration} мин • {session.notes}
														</p>
													</div>
												)
											)}
										</div>

										{/* Следующий сеанс */}
										<div className='bg-muted/50 rounded-lg p-4'>
											<p className='text-xs text-muted-foreground mb-2'>
												Следующий сеанс запланирован
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.sessionInfo.nextSessionPlanned}
											</p>
											<Button
												variant='ghost'
												size='sm'
												className='mt-2 text-primary hover:text-primary/80 p-0 h-auto'
											>
												Изменить дату →
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Эскиз и референсы */}
						{appointment.service.type === 'tattoo' && (
							<Card className='crypto-card'>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<CardTitle>Эскиз и референсы</CardTitle>
										<Button
											variant='ghost'
											size='sm'
											className='text-muted-foreground hover:text-foreground'
										>
											<ImageIcon className='w-4 h-4 mr-2' />
											Добавить
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{/* Основной эскиз */}
									<div className='mb-6'>
										<p className='text-sm text-muted-foreground mb-3'>
											Основной эскиз
										</p>
										{appointment.attachments
											.filter(file => file.type === 'sketch' && file.isMain)
											.map(file => (
												<div
													key={file.id}
													className='relative group cursor-pointer rounded-lg overflow-hidden border-2 border-primary/50 hover:border-primary transition-all'
													onClick={() => setSelectedImage(file.url || null)}
												>
													<img
														src={
															file.url ||
															'/placeholder.svg?height=400&width=600'
														}
														alt={file.name}
														className='w-full h-64 object-cover'
													/>
													<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
														<div className='text-center'>
															<ImageIcon className='w-8 h-8 text-white mx-auto mb-2' />
															<p className='text-white text-sm'>
																Нажмите для увеличения
															</p>
														</div>
													</div>
													<div className='absolute top-3 right-3'>
														<Badge className='bg-primary/90 text-white'>
															Основной эскиз
														</Badge>
													</div>
												</div>
											))}
									</div>

									{/* Референсы */}
									<div>
										<p className='text-sm text-muted-foreground mb-3'>
											Референсы (
											{
												appointment.attachments.filter(
													f => f.type === 'reference'
												).length
											}
											)
										</p>
										<div className='grid grid-cols-3 gap-3'>
											{appointment.attachments
												.filter(file => file.type === 'reference')
												.map(file => (
													<div
														key={file.id}
														className='relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-all aspect-square'
														onClick={() => setSelectedImage(file.url || null)}
													>
														<img
															src={
																file.url ||
																'/placeholder.svg?height=200&width=200'
															}
															alt={file.name}
															className='w-full h-full object-cover'
														/>
														<div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
															<ImageIcon className='w-6 h-6 text-white' />
														</div>
													</div>
												))}
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Информация о клиенте */}
						<Card className='crypto-card'>
							<CardContent className='pt-6'>
								<div className='flex items-start justify-between mb-6'>
									<div className='flex items-center gap-4'>
										<Avatar className='w-16 h-16 border-2 border-primary'>
											<AvatarImage
												src={appointment.client.avatar || '/placeholder.svg'}
												alt={appointment.client.name}
											/>
											<AvatarFallback>
												{appointment.client.name
													.split(' ')
													.map(n => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className='text-xl font-semibold text-card-foreground'>
												{appointment.client.name}
											</h3>
											<div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
												<span className='flex items-center gap-1'>
													<Star className='w-4 h-4 text-amber-500 fill-amber-500' />
													VIP клиент
												</span>
												<span>{appointment.client.totalVisits} визитов</span>
											</div>
										</div>
									</div>
									<Button
										variant='ghost'
										size='sm'
										className='text-muted-foreground hover:text-foreground'
									>
										<Edit className='w-4 h-4' />
									</Button>
								</div>

								<div className='grid grid-cols-2 gap-4 mb-6'>
									<div className='flex items-center gap-3 text-card-foreground'>
										<Phone className='w-4 h-4 text-muted-foreground' />
										<span className='text-sm'>{appointment.client.phone}</span>
									</div>
									<div className='flex items-center gap-3 text-card-foreground'>
										<Mail className='w-4 h-4 text-muted-foreground' />
										<span className='text-sm'>{appointment.client.email}</span>
									</div>
									<div className='flex items-center gap-3 text-card-foreground'>
										<Calendar className='w-4 h-4 text-muted-foreground' />
										<span className='text-sm'>
											Дата рождения: {appointment.client.birthDate}
										</span>
									</div>
									<div className='flex items-center gap-3 text-card-foreground'>
										<Euro className='w-4 h-4 text-muted-foreground' />
										<span className='text-sm'>
											Потрачено: €{appointment.client.totalSpent}
										</span>
									</div>
								</div>

								<Separator className='mb-4' />

								<div className='space-y-3'>
									<div>
										<p className='text-xs text-muted-foreground mb-1'>
											Заметки о клиенте
										</p>
										<p className='text-sm text-card-foreground'>
											{appointment.client.notes}
										</p>
									</div>
									{appointment.client.allergies && (
										<div className='flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3'>
											<AlertCircle className='w-4 h-4 text-red-500 mt-0.5' />
											<div>
												<p className='text-xs text-red-500 font-semibold'>
													Аллергии
												</p>
												<p className='text-sm text-red-600'>
													{appointment.client.allergies}
												</p>
											</div>
										</div>
									)}
									<div>
										<p className='text-xs text-muted-foreground mb-2'>
											Предпочтения
										</p>
										<div className='flex flex-wrap gap-2'>
											{appointment.client.preferences.map((pref, idx) => (
												<Badge
													key={idx}
													className='bg-primary/20 text-primary border-primary/30'
												>
													{pref}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Детали услуги */}
						<Card className='crypto-card'>
							<CardHeader>
								<div className='flex items-center justify-between'>
									<CardTitle>Детали услуги</CardTitle>
									<Badge className='bg-primary/20 text-primary border-primary/30'>
										{appointment.service.category}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div>
										<h4 className='text-xl font-semibold text-card-foreground mb-2'>
											{appointment.service.name}
										</h4>
										<p className='text-muted-foreground text-sm'>
											{appointment.service.description}
										</p>
									</div>

									<div className='grid grid-cols-2 gap-4 pt-4 border-t border-border'>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>
												Стиль
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.service.style}
											</p>
										</div>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>
												Размер
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.service.size}
											</p>
										</div>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>
												Расположение
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.service.placement}
											</p>
										</div>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>Цвет</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.service.color}
											</p>
										</div>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>
												Сложность
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.service.complexity}
											</p>
										</div>
										<div>
											<p className='text-xs text-muted-foreground mb-1'>
												Длительность
											</p>
											<p className='text-sm text-card-foreground font-medium'>
												{appointment.duration} минут
											</p>
										</div>
									</div>

									{appointment.service.type === 'tattoo' &&
										appointment.service.tattooDetails && (
											<div className='pt-4 border-t border-border'>
												<p className='text-sm font-semibold text-card-foreground mb-3'>
													Технические детали
												</p>
												<div className='grid grid-cols-2 gap-4'>
													<div>
														<p className='text-xs text-muted-foreground mb-1'>
															Техника
														</p>
														<p className='text-sm text-card-foreground font-medium'>
															{appointment.service.tattooDetails.technique}
														</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground mb-1'>
															Размер иглы
														</p>
														<p className='text-sm text-card-foreground font-medium'>
															{appointment.service.tattooDetails.needleSize}
														</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground mb-1'>
															Чернила
														</p>
														<p className='text-sm text-card-foreground font-medium'>
															{appointment.service.tattooDetails.inkBrand}
														</p>
													</div>
													<div>
														<p className='text-xs text-muted-foreground mb-1'>
															Заживление
														</p>
														<p className='text-sm text-card-foreground font-medium'>
															{appointment.service.tattooDetails.healingTime}
														</p>
													</div>
												</div>
												{appointment.service.tattooDetails.touchUpIncluded && (
													<div className='mt-3 flex items-center gap-2 text-sm text-green-600'>
														<CheckCircle2 className='w-4 h-4' />
														<span>Коррекция включена в стоимость</span>
													</div>
												)}
											</div>
										)}
								</div>
							</CardContent>
						</Card>

						{/* Соглашения и согласия */}
						{/* <Card className='crypto-card'>
							<CardHeader>
								<div className='flex items-center justify-between'>
									<CardTitle>Соглашения и согласия</CardTitle>
									{allAgreementsSigned ? (
										<Badge className='bg-green-500/20 text-green-600 border-green-500/30'>
											<CheckCircle2 className='w-3 h-3 mr-1' />
											Все подписаны
										</Badge>
									) : (
										<Badge className='bg-amber-500/20 text-amber-600 border-amber-500/30'>
											<AlertCircle className='w-3 h-3 mr-1' />
											Требуется подпись
										</Badge>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
										<Checkbox
											checked={agreements.serviceConsent}
											onCheckedChange={checked =>
												handleAgreementChange('serviceConsent', checked)
											}
											className='mt-1'
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium text-card-foreground mb-1'>
												Согласие на оказание услуги
											</p>
											<p className='text-xs text-muted-foreground'>
												Я ознакомлен(а) с процедурой и даю согласие на
												выполнение услуги
											</p>
										</div>
										<FileText className='w-4 h-4 text-muted-foreground' />
									</div>

									<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
										<Checkbox
											checked={agreements.healthDeclaration}
											onCheckedChange={checked =>
												handleAgreementChange('healthDeclaration', checked)
											}
											className='mt-1'
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium text-card-foreground mb-1'>
												Декларация о состоянии здоровья
											</p>
											<p className='text-xs text-muted-foreground'>
												Я подтверждаю отсутствие противопоказаний и
												аллергических реакций
											</p>
										</div>
										<FileText className='w-4 h-4 text-muted-foreground' />
									</div>

									<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
										<Checkbox
											checked={agreements.photoConsent}
											onCheckedChange={checked =>
												handleAgreementChange('photoConsent', checked)
											}
											className='mt-1'
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium text-card-foreground mb-1'>
												Согласие на фото/видео съемку
											</p>
											<p className='text-xs text-muted-foreground'>
												Разрешаю фотографировать результат работы для портфолио
											</p>
										</div>
										<Camera className='w-4 h-4 text-muted-foreground' />
									</div>

									<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
										<Checkbox
											checked={agreements.cancellationPolicy}
											onCheckedChange={checked =>
												handleAgreementChange('cancellationPolicy', checked)
											}
											className='mt-1'
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium text-card-foreground mb-1'>
												Политика отмены записи
											</p>
											<p className='text-xs text-muted-foreground'>
												Я ознакомлен(а) с условиями отмены и возврата предоплаты
											</p>
										</div>
										<FileText className='w-4 h-4 text-muted-foreground' />
									</div>

									<div className='flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
										<Checkbox
											checked={agreements.dataProcessing}
											onCheckedChange={checked =>
												handleAgreementChange('dataProcessing', checked)
											}
											className='mt-1'
										/>
										<div className='flex-1'>
											<p className='text-sm font-medium text-card-foreground mb-1'>
												Обработка персональных данных
											</p>
											<p className='text-xs text-muted-foreground'>
												Согласие на обработку и хранение персональных данных
												согласно GDPR
											</p>
										</div>
										<FileText className='w-4 h-4 text-muted-foreground' />
									</div>
								</div>

								{!allAgreementsSigned && (
									<div className='mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg'>
										<p className='text-sm text-amber-600'>
											<AlertCircle className='w-4 h-4 inline mr-2' />
											Для начала сеанса необходимо подписать все соглашения
										</p>
									</div>
								)}
							</CardContent>
						</Card> */}

						{/* Заметки к записи */}
						<Card className='crypto-card'>
							<CardHeader>
								<div className='flex items-center justify-between'>
									<CardTitle>Заметки к записи</CardTitle>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => setIsEditing(!isEditing)}
										className='text-muted-foreground hover:text-foreground'
									>
										<Edit className='w-4 h-4 mr-2' />
										{isEditing ? 'Сохранить' : 'Редактировать'}
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{isEditing ? (
									<Textarea
										value={notes}
										onChange={e => setNotes(e.target.value)}
										className='bg-background border-border text-foreground min-h-[100px]'
										placeholder='Добавьте заметки о записи...'
									/>
								) : (
									<p className='text-card-foreground text-sm'>{notes}</p>
								)}
							</CardContent>
						</Card>

						{/* Документы */}
						{/* <Card className='crypto-card'>
							<CardHeader>
								<CardTitle>Документы</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{appointment.attachments
										.filter(file => file.type === 'document')
										.map(file => (
											<div
												key={file.id}
												className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'
											>
												<div className='flex items-center gap-3'>
													<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
														<FileText className='w-5 h-5 text-primary' />
													</div>
													<div>
														<p className='text-sm font-medium text-card-foreground'>
															{file.name}
														</p>
														<p className='text-xs text-muted-foreground'>
															{file.size}
														</p>
													</div>
												</div>
												<Button
													variant='ghost'
													size='sm'
													className='text-muted-foreground hover:text-foreground'
												>
													<Download className='w-4 h-4' />
												</Button>
											</div>
										))}
									<Button
										variant='outline'
										className='w-full border-border text-muted-foreground hover:bg-accent'
									>
										+ Добавить документ
									</Button>
								</div>
							</CardContent>
						</Card> */}
					</div>

					{/* Правая колонка - Дополнительная информация */}
					<div className='space-y-6'>
						{/* Информация о мастере */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle>Мастер</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center gap-3 mb-4'>
									<Avatar className='w-12 h-12 border-2 border-primary'>
										<AvatarImage
											src={appointment.master.avatar || '/placeholder.svg'}
											alt={appointment.master.name}
										/>
										<AvatarFallback>
											{appointment.master.name
												.split(' ')
												.map(n => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold text-card-foreground'>
											{appointment.master.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											{appointment.master.specialization}
										</p>
									</div>
								</div>
								<div className='space-y-2 text-sm'>
									<div className='flex items-center gap-2 text-card-foreground'>
										<Phone className='w-4 h-4 text-muted-foreground' />
										<span>{appointment.master.phone}</span>
									</div>
									<div className='flex items-center gap-2 text-card-foreground'>
										<Mail className='w-4 h-4 text-muted-foreground' />
										<span className='text-xs'>{appointment.master.email}</span>
									</div>
									<Separator className='my-3' />
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Опыт</span>
										<span className='text-card-foreground font-medium'>
											{appointment.master.experience}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Рейтинг</span>
										<div className='flex items-center gap-1'>
											<Star className='w-4 h-4 text-amber-500 fill-amber-500' />
											<span className='text-card-foreground font-medium'>
												{appointment.master.rating}
											</span>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Сеансов</span>
										<span className='text-card-foreground font-medium'>
											{appointment.master.completedSessions}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Студия */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle>Студия</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<div>
										<p className='font-semibold text-card-foreground'>
											{appointment.studio.name}
										</p>
										<p className='text-sm text-muted-foreground mt-1'>
											{appointment.studio.room}
										</p>
									</div>
									<div className='flex items-start gap-2 text-sm text-card-foreground'>
										<MapPin className='w-4 h-4 text-muted-foreground mt-0.5' />
										<span>{appointment.studio.address}</span>
									</div>
									<Button
										variant='outline'
										className='w-full border-border text-muted-foreground hover:bg-accent mt-4'
									>
										<MapPin className='w-4 h-4 mr-2' />
										Показать на карте
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Финансы */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle>Финансы</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='text-card-foreground'>Базовая цена</span>
										<span className='text-card-foreground font-medium'>
											€{appointment.pricing.basePrice}
										</span>
									</div>

									{appointment.pricing.discount > 0 && (
										<div className='flex items-center justify-between text-green-600'>
											<span>Скидка</span>
											<span className='font-medium'>
												-€{appointment.pricing.discount}
											</span>
										</div>
									)}

									<Separator />

									<div className='flex items-center justify-between'>
										<span className='text-lg font-semibold text-card-foreground'>
											Итого
										</span>
										<span className='text-2xl font-bold text-card-foreground'>
											€{appointment.pricing.finalPrice}
										</span>
									</div>

									<Separator />

									<div className='space-y-3'>
										<div className='flex items-center justify-between'>
											<span className='text-card-foreground'>Предоплата</span>
											<span className='text-green-600 font-medium'>
												€{appointment.pricing.prepaid}
											</span>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-card-foreground'>К оплате</span>
											<span className='text-amber-600 font-semibold text-lg'>
												€{appointment.pricing.remaining}
											</span>
										</div>
									</div>

									<div className='pt-4 border-t border-border'>
										<p className='text-sm font-semibold text-card-foreground mb-3'>
											Способ оплаты
										</p>
										<div className='grid grid-cols-2 gap-2 mb-4'>
											<button
												onClick={() => setSelectedPaymentMethod('card')}
												className={`p-3 rounded-lg border transition-all ${
													selectedPaymentMethod === 'card'
														? 'bg-primary/20 border-primary text-card-foreground'
														: 'bg-muted/50 border-border text-muted-foreground hover:border-primary/50'
												}`}
											>
												<CreditCard className='w-5 h-5 mx-auto mb-1' />
												<span className='text-xs'>Карта</span>
											</button>
											<button
												onClick={() => setSelectedPaymentMethod('cash')}
												className={`p-3 rounded-lg border transition-all ${
													selectedPaymentMethod === 'cash'
														? 'bg-green-500/20 border-green-500 text-card-foreground'
														: 'bg-muted/50 border-border text-muted-foreground hover:border-primary/50'
												}`}
											>
												<Wallet className='w-5 h-5 mx-auto mb-1' />
												<span className='text-xs'>Наличные</span>
											</button>
											<button
												onClick={() => setSelectedPaymentMethod('certificate')}
												className={`p-3 rounded-lg border transition-all ${
													selectedPaymentMethod === 'certificate'
														? 'bg-purple-500/20 border-purple-500 text-card-foreground'
														: 'bg-muted/50 border-border text-muted-foreground hover:border-primary/50'
												}`}
											>
												<Receipt className='w-5 h-5 mx-auto mb-1' />
												<span className='text-xs'>Сертификат</span>
											</button>
											<button
												onClick={() => setSelectedPaymentMethod('bonus')}
												className={`p-3 rounded-lg border transition-all ${
													selectedPaymentMethod === 'bonus'
														? 'bg-amber-500/20 border-amber-500 text-card-foreground'
														: 'bg-muted/50 border-border text-muted-foreground hover:border-primary/50'
												}`}
											>
												<Star className='w-5 h-5 mx-auto mb-1' />
												<span className='text-xs'>Бонусы</span>
											</button>
										</div>

										{/* Информация о бонусах */}
										{selectedPaymentMethod === 'bonus' && (
											<div className='bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4'>
												<div className='flex items-center justify-between mb-2'>
													<span className='text-sm text-amber-600'>
														Доступно бонусов
													</span>
													<span className='text-lg font-bold text-amber-600'>
														{appointment.pricing.availableBonus}
													</span>
												</div>
												<p className='text-xs text-amber-600/70'>
													1 бонус = €{appointment.pricing.bonusRate} • Макс.
													списание: €
													{Math.min(
														appointment.pricing.remaining,
														appointment.pricing.availableBonus
													)}
												</p>
											</div>
										)}

										{/* Комбинированная оплата */}
										<div className='bg-muted/50 rounded-lg p-3 mb-4'>
											<p className='text-xs text-muted-foreground mb-2'>
												Комбинированная оплата
											</p>
											<div className='space-y-2'>
												{appointment.pricing.paymentMethods.map(
													(method, idx) => (
														<div
															key={idx}
															className='flex items-center justify-between text-sm'
														>
															<div className='flex items-center gap-2'>
																{method.icon === 'CreditCard' && (
																	<CreditCard className='w-4 h-4 text-primary' />
																)}
																{method.icon === 'Wallet' && (
																	<Wallet className='w-4 h-4 text-green-600' />
																)}
																{method.icon === 'Star' && (
																	<Star className='w-4 h-4 text-amber-600' />
																)}
																<span className='text-card-foreground'>
																	{method.label}
																</span>
															</div>
															<span className='text-card-foreground font-medium'>
																€{method.amount}
															</span>
														</div>
													)
												)}
											</div>
										</div>
									</div>

									<div className='pt-4 space-y-2'>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<CreditCard className='w-4 h-4' />
											<span>
												Способ оплаты: {appointment.pricing.paymentMethod}
											</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<Clock className='w-4 h-4' />
											<span>Предоплата: {appointment.pricing.prepaidAt}</span>
										</div>
									</div>

									<Button className='w-full bg-primary hover:bg-primary/90 mt-4'>
										<Wallet className='w-4 h-4 mr-2' />
										Принять оплату €{appointment.pricing.remaining}
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* История изменений */}
						<Card className='crypto-card'>
							<CardHeader>
								<div className='flex items-center gap-2'>
									<History className='w-5 h-5 text-muted-foreground' />
									<CardTitle>История</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{appointment.history.map((item, idx) => (
										<div key={idx} className='flex gap-3'>
											<div className='w-2 h-2 bg-primary rounded-full mt-2' />
											<div className='flex-1'>
												<p className='text-sm text-card-foreground'>
													{item.action}
												</p>
												<p className='text-xs text-muted-foreground mt-1'>
													{item.date} • {item.user}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Действия */}
						<Card className='crypto-card'>
							<CardHeader>
								<CardTitle>Действия</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<Button
										variant='outline'
										className='w-full border-border text-muted-foreground hover:bg-accent'
									>
										<MessageSquare className='w-4 h-4 mr-2' />
										Отправить сообщение
									</Button>
									<Button
										variant='outline'
										className='w-full border-border text-muted-foreground hover:bg-accent'
									>
										<Receipt className='w-4 h-4 mr-2' />
										Сформировать чек
									</Button>
									<Button
										variant='outline'
										className='w-full border-border text-muted-foreground hover:bg-accent'
									>
										<Edit className='w-4 h-4 mr-2' />
										Редактировать запись
									</Button>
									<Button
										variant='outline'
										className='w-full border-red-200 text-red-600 hover:bg-red-50'
										onClick={() => handleStatusChange('cancelled')}
									>
										<XCircle className='w-4 h-4 mr-2' />
										Отменить запись
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{selectedImage && (
				<div
					className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6'
					onClick={() => setSelectedImage(null)}
				>
					<div className='relative max-w-5xl w-full'>
						<Button
							variant='ghost'
							size='sm'
							className='absolute top-4 right-4 text-white hover:bg-white/20'
							onClick={() => setSelectedImage(null)}
						>
							<XCircle className='w-6 h-6' />
						</Button>
						<img
							src={selectedImage || '/placeholder.svg'}
							alt='Просмотр'
							className='w-full h-auto max-h-[90vh] object-contain rounded-lg'
						/>
					</div>
				</div>
			)}
		</div>
	)
}
