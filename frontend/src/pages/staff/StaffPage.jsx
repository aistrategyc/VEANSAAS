import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	UserCheck,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Phone,
	Mail,
	Star,
	Calendar,
} from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'

import { StaffList } from '@/features/staff/StaffList'

export default function StaffPage() {
	const staff = [
		{
			id: 1,
			name: 'Елена Кузнецова',
			role: 'Парикмахер-стилист',
			phone: '+33 1 42 86 83 26',
			email: 'elena.kuznetsova@salon.eu',
			rating: 4.9,
			experience: '8 лет',
			specializations: ['Стрижки', 'Окрашивание', 'Укладки', 'Кератин'],
			todayAppointments: 8,
			monthRevenue: '€5,200',
			status: 'active',
			workingHours: '09:00 - 18:00',
			nextBreak: '13:00 - 14:00',
			certificates: ['Международный стилист', "Колорист L'Oreal"],
			clientSatisfaction: 98,
		},
		{
			id: 2,
			name: 'Ольга Морозова',
			role: 'Мастер маникюра',
			phone: '+49 30 12345678',
			email: 'olga.morozova@salon.eu',
			rating: 4.8,
			experience: '5 лет',
			specializations: ['Маникюр', 'Педикюр', 'Наращивание', 'Дизайн ногтей'],
			todayAppointments: 6,
			monthRevenue: '€3,680',
			status: 'active',
			workingHours: '10:00 - 19:00',
			nextBreak: '14:00 - 15:00',
			certificates: ['Nail Art Master', 'Гель-лак специалист'],
			clientSatisfaction: 96,
		},
		{
			id: 3,
			name: 'Дмитрий Волков',
			role: 'Тату-мастер',
			phone: '+39 06 1234567',
			email: 'dmitry.volkov@salon.eu',
			rating: 4.9,
			experience: '12 лет',
			specializations: ['Татуировки', 'Эскизы', 'Реализм', 'Блэкворк'],
			todayAppointments: 3,
			monthRevenue: '€7,450',
			status: 'active',
			workingHours: '12:00 - 21:00',
			nextBreak: '16:00 - 17:00',
			certificates: ['Международная лицензия', 'Мастер реализма'],
			clientSatisfaction: 99,
		},
		{
			id: 4,
			name: 'Анна Лебедева',
			role: 'Мастер пирсинга',
			phone: '+34 91 123 45 67',
			email: 'anna.lebedeva@salon.eu',
			rating: 4.7,
			experience: '6 лет',
			specializations: ['Пирсинг', 'Украшения', 'Консультации', 'Заживление'],
			todayAppointments: 4,
			monthRevenue: '€2,780',
			status: 'vacation',
			workingHours: '11:00 - 20:00',
			nextBreak: 'В отпуске до 25.01',
			certificates: ['Сертификат безопасности', 'Анатомия пирсинга'],
			clientSatisfaction: 94,
		},
		{
			id: 5,
			name: 'Мария Соколова',
			role: 'Лазерный косметолог',
			phone: '+41 22 123 45 67',
			email: 'maria.sokolova@salon.eu',
			rating: 4.8,
			experience: '7 лет',
			specializations: ['Лазерная эпиляция', 'RF-лифтинг', 'Фотоомоложение'],
			todayAppointments: 5,
			monthRevenue: '€4,920',
			status: 'active',
			workingHours: '09:00 - 17:00',
			nextBreak: '12:30 - 13:30',
			certificates: ['Лазерная косметология', 'Аппаратная косметология'],
			clientSatisfaction: 97,
		},
		{
			id: 6,
			name: 'Александр Петров',
			role: 'Барбер',
			phone: '+43 1 123 45 67',
			email: 'alexander.petrov@salon.eu',
			rating: 4.9,
			experience: '4 года',
			specializations: ['Мужские стрижки', 'Бритье', 'Уход за бородой'],
			todayAppointments: 7,
			monthRevenue: '€3,150',
			status: 'active',
			workingHours: '10:00 - 19:00',
			nextBreak: '15:00 - 16:00',
			certificates: ['Классическое бритье', 'Мужская стилистика'],
			clientSatisfaction: 95,
		},
	]
	const statsEmployeeList = [
		{ id: 1, icon: UserCheck, count: '24', name: 'Всего сотрудников' },
		{ id: 2, icon: Badge, count: '21', name: 'Активные' },
		{ id: 3, icon: Calendar, count: '3', name: 'В отпуске' },
		{ id: 4, icon: Star, count: '4.8', name: 'Средний рейтинг' },
	]

	return (
		<div className='space-y-6'>
			<HeaderPages
				title='Сотрудники'
				description='Управление персоналом'
				nameButton='Добавить сотрудника'
			/>
			<StatsList stats={statsEmployeeList} />

			<StaffList staffs={staff} />
		</div>
	)
}
