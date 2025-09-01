import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Calendar,
	Users,
	DollarSign,
	TrendingUp,
	Clock,
	Star,
	Scissors,
	UserCheck,
	ArrowUpRight,
	ArrowDownRight,
	Edit,
	Eye,
	Plus,
	MoreHorizontal,
} from 'lucide-react'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts'

const revenueData = [
	{ name: 'Пн', revenue: 2400, bookings: 12 },
	{ name: 'Вт', revenue: 1398, bookings: 8 },
	{ name: 'Ср', revenue: 9800, bookings: 18 },
	{ name: 'Чт', revenue: 3908, bookings: 15 },
	{ name: 'Пт', revenue: 4800, bookings: 22 },
	{ name: 'Сб', revenue: 3800, bookings: 28 },
	{ name: 'Вс', revenue: 4300, bookings: 20 },
]

const serviceDistribution = [
	{ name: 'Стрижка', value: 35, color: '#3b82f6' },
	{ name: 'Маникюр', value: 25, color: '#ec4899' },
	{ name: 'Окрашивание', value: 20, color: '#8b5cf6' },
	{ name: 'Татуировка', value: 12, color: '#10b981' },
	{ name: 'Пирсинг', value: 8, color: '#f59e0b' },
]

export default function DashboardPage() {
	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Панель управления
					</h1>
					<p className='text-muted-foreground'>Добро пожаловать в BeautyCRM</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						className='hover:scale-105 transition-all duration-200 bg-transparent'
					>
						<Eye className='h-4 w-4 mr-2' />
						Обзор
					</Button>
					<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
						<Plus className='h-4 w-4 mr-2' />
						Новая запись
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium text-card-foreground'>
							Записи сегодня
						</CardTitle>
						<Calendar className='h-4 w-4 text-blue-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-card-foreground'>24</div>
						<div className='flex items-center text-xs'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+12%</span>
							<span className='text-muted-foreground ml-1'>от вчера</span>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium text-card-foreground'>
							Активные клиенты
						</CardTitle>
						<Users className='h-4 w-4 text-green-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-card-foreground'>1,247</div>
						<div className='flex items-center text-xs'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+8%</span>
							<span className='text-muted-foreground ml-1'>за месяц</span>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium text-card-foreground'>
							Выручка за день
						</CardTitle>
						<DollarSign className='h-4 w-4 text-purple-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-card-foreground'>
							€1,230
						</div>
						<div className='flex items-center text-xs'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+15%</span>
							<span className='text-muted-foreground ml-1'>от вчера</span>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium text-card-foreground'>
							Средний чек
						</CardTitle>
						<TrendingUp className='h-4 w-4 text-orange-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-card-foreground'>€51</div>
						<div className='flex items-center text-xs'>
							<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
							<span className='text-green-500'>+3%</span>
							<span className='text-muted-foreground ml-1'>за неделю</span>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Revenue Chart */}
				<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<TrendingUp className='h-5 w-5 text-primary' />
							Выручка за неделю
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width='100%' height={200}>
							<AreaChart data={revenueData}>
								<defs>
									<linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
										<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
								<XAxis dataKey='name' stroke='#9ca3af' />
								<YAxis stroke='#9ca3af' />
								<Tooltip
									contentStyle={{
										backgroundColor: '#1f2937',
										border: '1px solid #374151',
										borderRadius: '8px',
									}}
									formatter={value => [`€${value}`, 'Выручка']}
								/>
								<Area
									type='monotone'
									dataKey='revenue'
									stroke='#3b82f6'
									fillOpacity={1}
									fill='url(#colorRevenue)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Service Distribution Chart */}
				<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<Scissors className='h-5 w-5 text-primary' />
							Распределение услуг
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width='100%' height={200}>
							<PieChart>
								<Pie
									data={serviceDistribution}
									cx='50%'
									cy='50%'
									innerRadius={40}
									outerRadius={80}
									paddingAngle={5}
									dataKey='value'
								>
									{serviceDistribution.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1f2937',
										border: '1px solid #374151',
										borderRadius: '8px',
									}}
									formatter={value => [`${value}%`, 'Доля']}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className='flex flex-wrap gap-2 mt-4'>
							{serviceDistribution.map((item, index) => (
								<div key={index} className='flex items-center gap-1'>
									<div
										className='w-3 h-3 rounded-full'
										style={{ backgroundColor: item.color }}
									/>
									<span className='text-xs text-muted-foreground'>
										{item.name}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Today's Appointments */}
				<Card className='lg:col-span-2 bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<Clock className='h-5 w-5 text-primary' />
							Записи на сегодня
						</CardTitle>
						<div className='flex gap-2'>
							<Button
								size='sm'
								variant='outline'
								className='hover:scale-105 transition-all duration-200 bg-transparent'
							>
								<Plus className='h-4 w-4' />
							</Button>
							<Button
								size='sm'
								variant='outline'
								className='hover:scale-105 transition-all duration-200 bg-transparent'
							>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{[
								{
									time: '09:00',
									client: 'Анна Петрова',
									service: 'Стрижка + окрашивание',
									master: 'Елена К.',
									status: 'confirmed',
									priority: 'high',
									duration: '2ч 30мин',
									price: '€85',
									phone: '+33 1 23 45 67 89',
								},
								{
									time: '10:30',
									client: 'Мария Сидорова',
									service: 'Маникюр',
									master: 'Ольга М.',
									status: 'in-progress',
									priority: 'medium',
									duration: '1ч 15мин',
									price: '€35',
									phone: '+33 1 98 76 54 32',
								},
								{
									time: '12:00',
									client: 'Екатерина Иванова',
									service: 'Татуировка',
									master: 'Дмитрий В.',
									status: 'confirmed',
									priority: 'high',
									duration: '3ч 00мин',
									price: '€150',
									phone: '+33 1 11 22 33 44',
								},
								{
									time: '14:00',
									client: 'Светлана Козлова',
									service: 'Пирсинг',
									master: 'Анна Л.',
									status: 'pending',
									priority: 'low',
									duration: '30мин',
									price: '€25',
									phone: '+33 1 55 66 77 88',
								},
							].map((appointment, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.02] group'
								>
									<div className='flex items-center gap-3'>
										<div className='flex items-center gap-2'>
											<div
												className={`w-2 h-8 rounded-full ${
													appointment.priority === 'high'
														? 'bg-red-500'
														: appointment.priority === 'medium'
														? 'bg-yellow-500'
														: 'bg-green-500'
												}`}
											/>
											<Clock className='h-4 w-4 text-muted-foreground' />
											<span className='font-medium text-foreground'>
												{appointment.time}
											</span>
										</div>
										<div>
											<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
												{appointment.client}
											</p>
											<p className='text-sm text-muted-foreground'>
												{appointment.service}
											</p>
											<div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
												<span>Мастер: {appointment.master}</span>
												<span>•</span>
												<span>{appointment.duration}</span>
												<span>•</span>
												<span className='font-medium text-primary'>
													{appointment.price}
												</span>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<Badge
											variant={
												appointment.status === 'confirmed'
													? 'default'
													: appointment.status === 'in-progress'
													? 'secondary'
													: 'outline'
											}
											className={`transition-all duration-200 ${
												appointment.status === 'in-progress'
													? 'animate-pulse'
													: ''
											}`}
										>
											{appointment.status === 'confirmed'
												? 'Подтверждено'
												: appointment.status === 'in-progress'
												? 'В процессе'
												: 'Ожидает'}
										</Badge>
										<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
											<Button
												size='sm'
												variant='ghost'
												className='h-8 w-8 p-0 hover:bg-primary/10'
											>
												<Eye className='h-3 w-3' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												className='h-8 w-8 p-0 hover:bg-primary/10'
											>
												<Edit className='h-3 w-3' />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader>
						<CardTitle className='text-card-foreground'>
							Быстрые действия
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-3'>
						<Button
							className='w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-200 hover:scale-105'
							variant='outline'
						>
							<Calendar className='h-4 w-4 mr-2 text-blue-500' />
							Новая запись
						</Button>
						<Button
							className='w-full justify-start bg-transparent hover:bg-green-500/10 transition-all duration-200 hover:scale-105'
							variant='outline'
						>
							<Users className='h-4 w-4 mr-2 text-green-500' />
							Добавить клиента
						</Button>
						<Button
							className='w-full justify-start bg-transparent hover:bg-purple-500/10 transition-all duration-200 hover:scale-105'
							variant='outline'
						>
							<Scissors className='h-4 w-4 mr-2 text-purple-500' />
							Новая услуга
						</Button>
						<Button
							className='w-full justify-start bg-transparent hover:bg-orange-500/10 transition-all duration-200 hover:scale-105'
							variant='outline'
						>
							<UserCheck className='h-4 w-4 mr-2 text-orange-500' />
							Добавить мастера
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Top Services */}
				<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<Star className='h-5 w-5 text-yellow-500' />
							Популярные услуги
						</CardTitle>
						<Button
							size='sm'
							variant='ghost'
							className='text-primary hover:text-primary/80'
						>
							Все услуги
						</Button>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{[
								{
									name: 'Стрижка женская',
									bookings: 45,
									revenue: '€612',
									trend: 'up',
									color: 'bg-blue-500',
								},
								{
									name: 'Маникюр',
									bookings: 38,
									revenue: '€518',
									trend: 'up',
									color: 'bg-pink-500',
								},
								{
									name: 'Окрашивание',
									bookings: 32,
									revenue: '€1,306',
									trend: 'up',
									color: 'bg-purple-500',
								},
								{
									name: 'Татуировка',
									bookings: 15,
									revenue: '€2,040',
									trend: 'down',
									color: 'bg-green-500',
								},
							].map((service, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-all duration-200 group'
								>
									<div className='flex items-center gap-3'>
										<div className={`w-3 h-3 rounded-full ${service.color}`} />
										<div>
											<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
												{service.name}
											</p>
											<p className='text-sm text-muted-foreground'>
												{service.bookings} записей
											</p>
										</div>
									</div>
									<div className='text-right flex items-center gap-2'>
										<div>
											<p className='font-medium text-foreground'>
												{service.revenue}
											</p>
										</div>
										{service.trend === 'up' ? (
											<ArrowUpRight className='h-4 w-4 text-green-500' />
										) : (
											<ArrowDownRight className='h-4 w-4 text-red-500' />
										)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Top Masters */}
				<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<UserCheck className='h-5 w-5 text-primary' />
							Лучшие мастера
						</CardTitle>
						<Button
							size='sm'
							variant='ghost'
							className='text-primary hover:text-primary/80'
						>
							Все мастера
						</Button>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{[
								{
									name: 'Елена Кузнецова',
									rating: 4.9,
									bookings: 28,
									revenue: '€1,142',
									position: 1,
									specialty: 'Стрижка, окрашивание',
									experience: '8 лет',
								},
								{
									name: 'Ольга Морозова',
									rating: 4.8,
									bookings: 25,
									revenue: '€1,020',
									position: 2,
									specialty: 'Маникюр, педикюр',
									experience: '5 лет',
								},
								{
									name: 'Дмитрий Волков',
									rating: 4.9,
									bookings: 15,
									revenue: '€2,040',
									position: 3,
									specialty: 'Татуировка',
									experience: '12 лет',
								},
								{
									name: 'Анна Лебедева',
									rating: 4.7,
									bookings: 20,
									revenue: '€816',
									position: 4,
									specialty: 'Пирсинг',
									experience: '3 года',
								},
							].map((master, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-all duration-200 group'
								>
									<div className='flex items-center gap-3'>
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
												master.position === 1
													? 'bg-yellow-500 text-black'
													: master.position === 2
													? 'bg-gray-400 text-white'
													: master.position === 3
													? 'bg-orange-500 text-white'
													: 'bg-muted text-muted-foreground'
											}`}
										>
											{master.position}
										</div>
										<div>
											<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
												{master.name}
											</p>
											<div className='flex items-center gap-2'>
												<Star className='h-3 w-3 text-yellow-500 fill-current' />
												<span className='text-sm text-muted-foreground'>
													{master.rating}
												</span>
												<span className='text-sm text-muted-foreground'>
													• {master.bookings} записей
												</span>
											</div>
											<div className='text-xs text-muted-foreground mt-1'>
												<span>{master.specialty}</span>
												<span className='ml-2'>
													• Опыт: {master.experience}
												</span>
											</div>
										</div>
									</div>
									<div className='text-right flex items-center gap-2'>
										<div>
											<p className='font-medium text-foreground'>
												{master.revenue}
											</p>
										</div>
										<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
											<Button
												size='sm'
												variant='ghost'
												className='h-8 w-8 p-0 hover:bg-primary/10'
											>
												<Eye className='h-3 w-3' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												className='h-8 w-8 p-0 hover:bg-primary/10'
											>
												<Edit className='h-3 w-3' />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
