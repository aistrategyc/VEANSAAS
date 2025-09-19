import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { MetricCard } from '@/features/dashboard/DashboardMetricCard'
import {
	Calendar,
	Users,
	DollarSign,
	Clock,
	TrendingUp,
	UserCheck,
	Scissors,
	MapPin,
} from 'lucide-react'
import { useSelector } from 'react-redux'

// Mock data for different roles
const getMockData = role => {
	const baseData = {
		todayAppointments: 12,
		totalClients: 156,
		monthlyRevenue: 45000,
		avgSessionTime: 85,
	}

	switch (role) {
		case 'admin':
			return {
				...baseData,
				totalMasters: 8,
				totalLocations: 3,
				utilizationRate: 78,
				newClientsThisMonth: 23,
			}
		case 'masterOwner':
			return {
				...baseData,
				mySpaces: 2,
				myRevenue: 15000,
				myUtilization: 85,
				myClients: 45,
			}
		case 'master':
			return {
				todayAppointments: 8,
				weeklyHours: 32,
				completedServices: 156,
				clientRating: 4.8,
			}
		case 'student':
			return {
				practiceHours: 120,
				completedLessons: 15,
				mentorRating: 4.5,
				nextLesson: 'Завтра в 14:00',
			}
		default:
			return baseData
	}
}

export default function DashboardPageNew() {
	const roleId = useSelector(state => state.rootReducer.rolesCurrent.roleId)
	const roles = useSelector(state => state.rootReducer.roles?.roles)
	const role = roles.find(r => r.name === roleId)
	const data = getMockData(role.name)

	const renderAdminDashboard = () => (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<MetricCard
					title='Записи сегодня'
					value={data.todayAppointments.toString()}
					icon={Calendar}
					trend={{ value: 12, label: 'с прошлой недели', isPositive: true }}
				/>
				<MetricCard
					title='Всего клиентов'
					value={data.totalClients.toString()}
					icon={Users}
					trend={{ value: 8, label: 'за месяц', isPositive: true }}
				/>
				<MetricCard
					title='Доход за месяц'
					value={`₽${data.monthlyRevenue.toLocaleString()}`}
					icon={DollarSign}
					trend={{ value: 15, label: 'с прошлого месяца', isPositive: true }}
				/>
				<MetricCard
					title='Загрузка'
					value={`${data.utilizationRate}%`}
					icon={TrendingUp}
					trend={{ value: 5, label: 'с прошлой недели', isPositive: true }}
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<MetricCard
					title='Мастеров'
					value={data.totalMasters.toString()}
					icon={UserCheck}
					description='Активных специалистов'
				/>
				<MetricCard
					title='Локаций'
					value={data.totalLocations.toString()}
					icon={MapPin}
					description='Рабочих точек'
				/>
				<MetricCard
					title='Новые клиенты'
					value={data.newClientsThisMonth.toString()}
					icon={Users}
					description='За текущий месяц'
				/>
			</div>
		</div>
	)

	const renderMasterOwnerDashboard = () => (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<MetricCard
					title='Записи сегодня'
					value={data.todayAppointments.toString()}
					icon={Calendar}
				/>
				<MetricCard
					title='Мои локации'
					value={data.mySpaces.toString()}
					icon={MapPin}
				/>
				<MetricCard
					title='Мой доход'
					value={`₽${data.myRevenue.toLocaleString()}`}
					icon={DollarSign}
				/>
				<MetricCard
					title='Загрузка'
					value={`${data.myUtilization}%`}
					icon={TrendingUp}
				/>
			</div>
		</div>
	)

	const renderMasterDashboard = () => (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<MetricCard
					title='Записи сегодня'
					value={data.todayAppointments.toString()}
					icon={Calendar}
				/>
				<MetricCard
					title='Часов в неделю'
					value={data.weeklyHours.toString()}
					icon={Clock}
				/>
				<MetricCard
					title='Услуг выполнено'
					value={data.completedServices.toString()}
					icon={Scissors}
				/>
				<MetricCard
					title='Рейтинг'
					value={data.clientRating.toString()}
					icon={TrendingUp}
					description='Средняя оценка клиентов'
				/>
			</div>
		</div>
	)

	const renderStudentDashboard = () => (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<MetricCard
					title='Часов практики'
					value={data.practiceHours.toString()}
					icon={Clock}
				/>
				<MetricCard
					title='Уроков пройдено'
					value={data.completedLessons.toString()}
					icon={Calendar}
				/>
				<MetricCard
					title='Оценка наставника'
					value={data.mentorRating.toString()}
					icon={TrendingUp}
				/>
				<MetricCard
					title='Следующий урок'
					value={data.nextLesson}
					icon={Calendar}
				/>
			</div>
		</div>
	)

	const renderDashboardContent = () => {
		switch (role.name) {
			case 'admin':
				return renderAdminDashboard()
			case 'masterOwner':
				return renderMasterOwnerDashboard()
			case 'master':
				return renderMasterDashboard()
			case 'student':
				return renderStudentDashboard()
			default:
				return (
					<div className='text-center py-8'>
						<p className='text-muted-foreground'>
							Выберите роль для просмотра дашборда
						</p>
					</div>
				)
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Добро пожаловать {role.name}
				</h1>
				<p className='text-muted-foreground'>
					Обзор вашей деятельности и ключевые показатели
				</p>
			</div>

			{renderDashboardContent()}

			<div className='grid gap-4 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Последние записи</CardTitle>
						<CardDescription>Ближайшие запланированные услуги</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{[
								{
									time: '10:00',
									client: 'Анна Петрова',
									service: 'Стрижка и укладка',
								},
								{
									time: '11:30',
									client: 'Мария Сидорова',
									service: 'Окрашивание',
								},
								{
									time: '14:00',
									client: 'Елена Козлова',
									service: 'Маникюр',
								},
							].map((appointment, i) => (
								<div key={i} className='flex items-center space-x-4'>
									<div className='w-12 text-sm font-medium text-muted-foreground'>
										{appointment.time}
									</div>
									<div className='flex-1'>
										<p className='text-sm font-medium'>{appointment.client}</p>
										<p className='text-xs text-muted-foreground'>
											{appointment.service}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Быстрые действия</CardTitle>
						<CardDescription>Часто используемые функции</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-2'>
							<button className='flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left'>
								<Calendar className='w-4 h-4' />
								<span className='text-sm'>Создать запись</span>
							</button>
							<button className='flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left'>
								<Users className='w-4 h-4' />
								<span className='text-sm'>Добавить клиента</span>
							</button>
							<button className='flex items-center space-x-2 p-2 rounded-md hover:bg-muted text-left'>
								<Scissors className='w-4 h-4' />
								<span className='text-sm'>Управление услугами</span>
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
