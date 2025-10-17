import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { MainStats } from '@/features/main/MainStats'
import { RevenueChart } from '@/features/chart/RevenueChart'
import { DistributionChart } from '@/features/chart/DistributionChart'
import { TodayAppointments } from '../../features/appointments/TodayAppointments'
import { MainActions } from '../../features/main/MainActions'

import { StaffTopList } from '../../features/staff/StaffTopList'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { useState } from 'react'
import { PermissionGuard } from '@/widgets/permissions/PermissionGuard'

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

const todayAppointments = [
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
]

const serviceTopList = [
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
]
const staffTopList = [
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
]
export default function MainPage() {
	const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState(null)

	const handleAppointmentSave = appointmentData => {
		console.log('[v0] Saving appointment:', appointmentData)
		mockAppointments.push(appointmentData)
		// Here would be the actual save logic
		setIsAppointmentModalOpen(false)
		setSelectedAppointment(null)
		setSelectedSlot(null)
	}

	const handleAppointmentDelete = appointmentId => {
		console.log('[v0] Deleting appointment:', appointmentId)
		// Here would be the actual delete logic
		setIsAppointmentModalOpen(false)
		setSelectedAppointment(null)
	}

	const handleAppointmentIsOpenModal = () => {
		setIsAppointmentModalOpen(true)
	}
	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			<HeaderPages
				description='Добро пожаловать в BeautyCRM'
				title='Панель управления'
				type='main'
				onClick={handleAppointmentIsOpenModal}
			/>
			<PermissionGuard requiredAll={['main-stats:view']} scope='studio'>
				<MainStats />
			</PermissionGuard>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<RevenueChart revenueData={revenueData} />
				<DistributionChart distributions={serviceDistribution} />
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<TodayAppointments todayAppointments={todayAppointments} />
				<MainActions addAppointment={handleAppointmentIsOpenModal} />
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<StaffTopList staffList={staffTopList} />
			</div>
			<AppointmentModal
				isOpen={isAppointmentModalOpen}
				onClose={() => {
					setIsAppointmentModalOpen(false)
					setSelectedAppointment(null)
					setSelectedSlot(null)
				}}
				appointment={selectedAppointment}
				onSave={handleAppointmentSave}
				onDelete={handleAppointmentDelete}
			/>
		</div>
	)
}
