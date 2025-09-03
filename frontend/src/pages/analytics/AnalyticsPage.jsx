import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { AnalyticsStats } from '@/features/analytics/AnalyticsStats'
import { AnalyticsService } from '@/features/analytics/AnalyticsService'
import { AnalyticsMasters } from '@/features/analytics/AnalyticsMasters'
import { AnalyticsTimeSlot } from '@/features/analytics/AnalyticsTimeSlot'

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
			value: '$3,250',
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
			revenue: '$362,500',
			avgPrice: '$2,500',
			satisfaction: 4.8,
			growth: '+15%',
		},
		{
			service: 'Окрашивание',
			bookings: 89,
			revenue: '$400,500',
			avgPrice: '$4,500',
			satisfaction: 4.9,
			growth: '+22%',
		},
		{
			service: 'Маникюр',
			bookings: 234,
			revenue: '$421,200',
			avgPrice: '$1,800',
			satisfaction: 4.7,
			growth: '+8%',
		},
		{
			service: 'Татуировка',
			bookings: 45,
			revenue: '$675,000',
			avgPrice: '$15,000',
			satisfaction: 4.9,
			growth: '+35%',
		},
	]

	const masterPerformance = [
		{
			name: 'Елена Кузнецова',
			bookings: 89,
			revenue: '$267,000',
			rating: 4.9,
			efficiency: 95,
			growth: '+18%',
		},
		{
			name: 'Дмитрий Волков',
			bookings: 45,
			revenue: '$675,000',
			rating: 4.9,
			efficiency: 98,
			growth: '+35%',
		},
		{
			name: 'Ольга Морозова',
			bookings: 156,
			revenue: '$280,800',
			rating: 4.8,
			efficiency: 92,
			growth: '+12%',
		},
		{
			name: 'Анна Лебедева',
			bookings: 67,
			revenue: '$134,000',
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
			<HeaderPages
				description='Детальная аналитика и отчеты'
				type='analytics'
				title='Аналитика'
			/>
			<AnalyticsStats kpis={kpis} />
			<AnalyticsService serviceAnalytics={serviceAnalytics} />
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<AnalyticsMasters masterPerformance={masterPerformance} />
				<AnalyticsTimeSlot timeSlotAnalytics={timeSlotAnalytics} />
			</div>
		</div>
	)
}
