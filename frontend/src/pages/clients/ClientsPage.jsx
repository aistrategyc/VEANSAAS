import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { ClientList } from '@/features/clients/ClientList'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { Calendar, Star, Users } from 'lucide-react'

export default function ClientsPage() {
	const clients = [
		{
			id: 1,
			name: 'Анна Петрова',
			phone: '+33 1 42 86 83 26',
			email: 'anna.petrova@email.com',
			lastVisit: '2024-01-10',
			totalVisits: 15,
			totalSpent: '€2,750',
			status: 'vip',
			nextAppointment: '2024-01-15 09:00',
			services: ['Маникюр', 'Педикюр', 'Наращивание ресниц'],
			notes: 'Предпочитает утренние записи',
		},
		{
			id: 2,
			name: 'Мария Сидорова',
			phone: '+49 30 12345678',
			email: 'maria.sidorova@email.com',
			lastVisit: '2024-01-08',
			totalVisits: 8,
			totalSpent: '€1,200',
			status: 'regular',
			nextAppointment: '2024-01-15 10:30',
			services: ['Стрижка', 'Окрашивание'],
			notes: 'Аллергия на аммиак',
		},
		{
			id: 3,
			name: 'Екатерина Иванова',
			phone: '+39 06 1234567',
			email: 'ekaterina.ivanova@email.com',
			lastVisit: '2024-01-05',
			totalVisits: 3,
			totalSpent: '€1,850',
			status: 'new',
			nextAppointment: '2024-01-15 12:00',
			services: ['Татуировка', 'Пирсинг'],
			notes: 'Первая большая работа',
		},
		{
			id: 4,
			name: 'Светлана Козлова',
			phone: '+34 91 123 45 67',
			email: 'svetlana.kozlova@email.com',
			lastVisit: '2023-12-20',
			totalVisits: 12,
			totalSpent: '€1,480',
			status: 'inactive',
			nextAppointment: null,
			services: ['Массаж', 'Косметология'],
			notes: 'Не отвечает на звонки',
		},
		{
			id: 5,
			name: 'Ольга Морозова',
			phone: '+41 22 123 45 67',
			email: 'olga.morozova@email.com',
			lastVisit: '2024-01-12',
			totalVisits: 22,
			totalSpent: '€3,200',
			status: 'vip',
			nextAppointment: '2024-01-16 14:00',
			services: ['Лазерная эпиляция', 'RF-лифтинг'],
			notes: 'Постоянный клиент, скидка 15%',
		},
		{
			id: 6,
			name: 'Дарья Волкова',
			phone: '+43 1 123 45 67',
			email: 'darya.volkova@email.com',
			lastVisit: '2024-01-09',
			totalVisits: 5,
			totalSpent: '€680',
			status: 'regular',
			nextAppointment: '2024-01-17 11:00',
			services: ['Брови', 'Ламинирование ресниц'],
			notes: 'Студентка, скидка 10%',
		},
	]
	const statsClientList = [
		{ id: 1, icon: Users, count: '1,247', name: 'Всего клиентов' },
		{ id: 2, icon: Star, count: 156, name: 'VIP клиентов' },
		{ id: 3, icon: Calendar, count: 89, name: 'Новые за месяц' },
		{ id: 4, count: 23, name: 'Неактивные' },
	]
	return (
		<div className='space-y-6'>
			<HeaderPages
				title='Клиенты'
				description='База данных клиентов'
				nameButton='Добавить клиента'
			/>
			<StatsList stats={statsClientList} />
			<FiltersPages />
			<ClientList clients={clients} />
		</div>
	)
}
