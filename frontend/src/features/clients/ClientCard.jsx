import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
	Calendar,
	Clock,
	Edit,
	Mail,
	MessageSquare,
	Phone,
	Plus,
	Star,
	TrendingUp,
	User,
	Scissors,
	Sparkles,
} from 'lucide-react'
import { HeaderPages } from '../headerPages/HeaderPages'
import { ClientInfoCard } from './ClientInfoCard'
import { ClientAppointments } from './ClientAppointments'
import { ClientHistoryAppointments } from './ClientHistoryAppointments'
import { ClientNotes } from './ClientNotes'

// Mock data for demonstration
const clientData = {
	id: '1',
	name: 'Анна Петрова',
	email: 'anna.petrova@email.com',
	phone: '+45 123-45-67',
	avatar: '/woman-portrait.png',
	joinDate: '2023-03-15',
	totalVisits: 12,
	totalSpent: 4560,
	lastVisit: '2024-01-15',
	nextAppointment: '2024-01-25',
	preferredServices: ['Стрижка', 'Окрашивание', 'Укладка'],
	notes: 'Предпочитает натуральные оттенки. Аллергия на аммиак.',
	status: 'VIP',
}

const appointmentHistory = [
	{
		id: 1,
		date: '2024-01-15',
		time: '14:00',
		service: 'Стрижка + Окрашивание',
		master: 'Мария Иванова',
		price: 450,
		status: 'completed',
	},
	{
		id: 2,
		date: '2023-12-20',
		time: '16:30',
		service: 'Укладка',
		master: 'Елена Сидорова',
		price: 200,
		status: 'completed',
	},
	{
		id: 3,
		date: '2023-11-28',
		time: '15:00',
		service: 'Стрижка',
		master: 'Мария Иванова',
		price: 250,
		status: 'completed',
	},
]

const upcomingAppointments = [
	{
		id: 4,
		date: '2024-01-25',
		time: '15:30',
		service: 'Окрашивание корней',
		master: 'Мария Иванова',
		price: 350,
		status: 'scheduled',
	},
]

export default function ClientCard() {
	return (
		<div className='min-h-screen bg-background p-6'>
			<div className='max-w-7xl mx-auto space-y-6'>
				<HeaderPages
					title='Карточка клиента'
					description='Управление информацией о клиенте'
					type='clientCard'
				/>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<ClientInfoCard clientData={clientData} />
					<div className='lg:col-span-2'>
						<Tabs defaultValue='appointments' className='space-y-6'>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='appointments'>Записи</TabsTrigger>
								<TabsTrigger value='history'>История</TabsTrigger>
								<TabsTrigger value='notes'>Заметки</TabsTrigger>
							</TabsList>
							<ClientAppointments upcomingAppointments={upcomingAppointments} />
							<ClientHistoryAppointments
								appointmentHistory={appointmentHistory}
								clientData={clientData}
							/>
							<ClientNotes clientData={clientData} />
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}
