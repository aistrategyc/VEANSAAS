import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	TrendingUp,
	TrendingDown,
	Users,
	Calendar,
	Scissors,
	Euro,
	Clock,
	Star,
} from 'lucide-react'
import { Sidebar } from '@/features/sidebar/Sidebar'
import { TopHeader } from '@/features/header/TopHeader'
import { DashboardStats } from '@/features/dashboard/DashboardStats'
import { DashboardServicesCard } from '@/features/dashboard/DashboardServicesCard'
import { DashboardAppointmentsCard } from '@/features/dashboard/DashboardAppointmentsCard'
import { DashboardStaffCard } from '@/features/dashboard/DashboardStaffCard'
import { DashboardFinancesCard } from '@/features/dashboard/DashboardFinancesCard'
import { DashboardFinancesServiceCard } from '@/features/dashboard/DashboardFinancesServiceCard'
import { DashboardCalendarCard } from '@/features/dashboard/DashboardCalendarCard'
import { useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'

const DashboardPage = () => {
	const beautyStats = [
		{
			name: 'Записи сегодня',
			value: '47',
			change: '+12%',
			trend: 'up',
			icon: Calendar,
			color: 'text-blue-500',
			description: 'активных записей',
		},
		{
			name: 'Выручка',
			value: '€2,340',
			change: '+8.5%',
			trend: 'up',
			icon: Euro,
			color: 'text-green-500',
			description: 'за сегодня',
			role: 'admin',
		},
		{
			name: 'Клиенты',
			value: '156',
			change: '+15%',
			trend: 'up',
			icon: Users,
			color: 'text-purple-500',
			description: 'новых за месяц',
		},
		{
			name: 'Загрузка',
			value: '87%',
			change: '-2%',
			trend: 'down',
			icon: Clock,
			color: 'text-orange-500',
			description: 'мастеров',
		},
	]

	const popularServices = [
		{
			name: 'Женская стрижка',
			bookings: '23',
			revenue: '€1,150',
			status: 'Популярно',
		},
		{ name: 'Маникюр', bookings: '18', revenue: '€540', status: 'Популярно' },
	]

	const upcomingAppointments = [
		{
			client: 'Анна Петрова',
			service: 'Окрашивание',
			time: '14:30',
			price: '€85',
			master: 'Елена К.',
		},
		{
			client: 'Мария Сидорова',
			service: 'Маникюр',
			time: '15:00',
			price: '€35',
			master: 'Ольга М.',
		},
		{
			client: 'Екатерина Иванова',
			service: 'Стрижка',
			time: '16:30',
			price: '€45',
			master: 'Елена К.',
		},
	]

	return (
		<div className='flex h-screen bg-background'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<TopHeader />
				<main className='flex-1 overflow-auto p-6'>
					<DashboardStats stats={beautyStats} />
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						<DashboardServicesCard services={popularServices} />
						<DashboardAppointmentsCard appointments={upcomingAppointments} />
						<DashboardStaffCard />
					</div>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
						<DashboardFinancesCard />
						<DashboardFinancesServiceCard />
						<DashboardCalendarCard />
					</div>
				</main>
			</div>
		</div>
	)
}

export default DashboardPage
