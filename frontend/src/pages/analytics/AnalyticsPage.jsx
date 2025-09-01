import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, Clock, Star, Target } from 'lucide-react'

export default function AnalyticsPage() {
	const kpis = [
		{
			title: 'Конверсия записей',
			value: '87%',
			change: '+5%',
			trend: 'up',
			description: 'Процент подтвержденных записей',
		},
		{
			title: 'Средний чек',
			value: '₽3,250',
			change: '+12%',
			trend: 'up',
			description: 'Средняя стоимость услуги',
		},
		{
			title: 'Повторные клиенты',
			value: '68%',
			change: '+8%',
			trend: 'up',
			description: 'Клиенты с повторными визитами',
		},
		{
			title: 'Загрузка мастеров',
			value: '92%',
			change: '-3%',
			trend: 'down',
			description: 'Средняя загрузка персонала',
		},
	]

	const serviceAnalytics = [
		{
			service: 'Женская стрижка',
			bookings: 145,
			revenue: '₽362,500',
			avgPrice: '₽2,500',
			satisfaction: 4.8,
			growth: '+15%',
		},
		{
			service: 'Окрашивание',
			bookings: 89,
			revenue: '₽400,500',
			avgPrice: '₽4,500',
			satisfaction: 4.9,
			growth: '+22%',
		},
		{
			service: 'Маникюр',
			bookings: 234,
			revenue: '₽421,200',
			avgPrice: '₽1,800',
			satisfaction: 4.7,
			growth: '+8%',
		},
		{
			service: 'Татуировка',
			bookings: 45,
			revenue: '₽675,000',
			avgPrice: '₽15,000',
			satisfaction: 4.9,
			growth: '+35%',
		},
	]

	const masterPerformance = [
		{
			name: 'Елена Кузнецова',
			bookings: 89,
			revenue: '₽267,000',
			rating: 4.9,
			efficiency: 95,
			growth: '+18%',
		},
		{
			name: 'Дмитрий Волков',
			bookings: 45,
			revenue: '₽675,000',
			rating: 4.9,
			efficiency: 98,
			growth: '+35%',
		},
		{
			name: 'Ольга Морозова',
			bookings: 156,
			revenue: '₽280,800',
			rating: 4.8,
			efficiency: 92,
			growth: '+12%',
		},
		{
			name: 'Анна Лебедева',
			bookings: 67,
			revenue: '₽134,000',
			rating: 4.7,
			efficiency: 88,
			growth: '+25%',
		},
	]

	const timeSlotAnalytics = [
		{ time: '09:00-11:00', bookings: 45, occupancy: 85 },
		{ time: '11:00-13:00', bookings: 67, occupancy: 95 },
		{ time: '13:00-15:00', bookings: 52, occupancy: 78 },
		{ time: '15:00-17:00', bookings: 89, occupancy: 98 },
		{ time: '17:00-19:00', bookings: 78, occupancy: 92 },
		{ time: '19:00-21:00', bookings: 34, occupancy: 65 },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Аналитика</h1>
					<p className='text-muted-foreground'>Детальная аналитика и отчеты</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Экспорт</Button>
					<Button className='bg-primary hover:bg-primary/90'>
						Создать отчет
					</Button>
				</div>
			</div>

			{/* KPIs */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{kpis.map((kpi, index) => (
					<Card
						key={index}
						className='bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105'
					>
						<CardContent className='pt-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm text-muted-foreground'>{kpi.title}</p>
									<p className='text-2xl font-bold text-card-foreground'>
										{kpi.value}
									</p>
									<p className='text-xs text-muted-foreground mt-1'>
										{kpi.description}
									</p>
								</div>
								<div className='text-right'>
									<div
										className={`flex items-center gap-1 ${
											kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
										}`}
									>
										<TrendingUp
											className={`h-4 w-4 ${
												kpi.trend === 'down' ? 'rotate-180' : ''
											}`}
										/>
										<span className='text-sm font-medium'>{kpi.change}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Service Analytics */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<BarChart3 className='h-5 w-5 text-primary' />
						Аналитика услуг
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{serviceAnalytics.map((service, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200'
							>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
										<Target className='h-5 w-5 text-primary' />
									</div>
									<div>
										<p className='font-medium text-foreground'>
											{service.service}
										</p>
										<div className='flex items-center gap-4 text-sm text-muted-foreground'>
											<span>{service.bookings} записей</span>
											<span>Средний чек: {service.avgPrice}</span>
										</div>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{service.revenue}
										</p>
										<p className='text-xs text-muted-foreground'>Выручка</p>
									</div>
									<div className='text-center'>
										<div className='flex items-center gap-1'>
											<Star className='h-3 w-3 text-yellow-500 fill-current' />
											<span className='font-medium text-foreground'>
												{service.satisfaction}
											</span>
										</div>
										<p className='text-xs text-muted-foreground'>Рейтинг</p>
									</div>
									<Badge
										variant='outline'
										className='text-green-500 border-green-500'
									>
										{service.growth}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Master Performance & Time Slots */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Master Performance */}
				<Card className='bg-card border-border'>
					<CardHeader>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<Users className='h-5 w-5 text-primary' />
							Эффективность мастеров
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{masterPerformance.map((master, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 rounded-lg bg-muted/20'
								>
									<div>
										<p className='font-medium text-foreground'>{master.name}</p>
										<div className='flex items-center gap-3 text-sm text-muted-foreground'>
											<span>{master.bookings} записей</span>
											<div className='flex items-center gap-1'>
												<Star className='h-3 w-3 text-yellow-500 fill-current' />
												<span>{master.rating}</span>
											</div>
										</div>
									</div>
									<div className='text-right'>
										<p className='font-medium text-foreground'>
											{master.revenue}
										</p>
										<div className='flex items-center gap-2'>
											<span className='text-xs text-muted-foreground'>
												{master.efficiency}% эффективность
											</span>
											<Badge
												variant='outline'
												className='text-green-500 border-green-500 text-xs'
											>
												{master.growth}
											</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Time Slot Analytics */}
				<Card className='bg-card border-border'>
					<CardHeader>
						<CardTitle className='text-card-foreground flex items-center gap-2'>
							<Clock className='h-5 w-5 text-primary' />
							Загрузка по времени
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{timeSlotAnalytics.map((slot, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 rounded-lg bg-muted/20'
								>
									<div className='flex items-center gap-3'>
										<Clock className='h-4 w-4 text-muted-foreground' />
										<span className='font-medium text-foreground'>
											{slot.time}
										</span>
									</div>
									<div className='flex items-center gap-4'>
										<div className='text-center'>
											<p className='font-medium text-foreground'>
												{slot.bookings}
											</p>
											<p className='text-xs text-muted-foreground'>Записей</p>
										</div>
										<div className='text-center'>
											<p
												className={`font-medium ${
													slot.occupancy >= 90
														? 'text-green-500'
														: slot.occupancy >= 70
														? 'text-yellow-500'
														: 'text-red-500'
												}`}
											>
												{slot.occupancy}%
											</p>
											<p className='text-xs text-muted-foreground'>Загрузка</p>
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
