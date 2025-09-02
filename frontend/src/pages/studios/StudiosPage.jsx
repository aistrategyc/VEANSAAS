import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Building2,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	MapPin,
	Phone,
	Users,
	Clock,
	DollarSign,
} from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { StudiosGrid } from '@/features/studios/StudiosGrid'

export default function StudiosPage() {
	const studios = [
		{
			id: 1,
			name: 'Beauty Studio Центр',
			address: 'ул. Тверская, 15',
			phone: '+7 (495) 123-45-67',
			manager: 'Елена Петрова',
			staff: 12,
			rooms: 8,
			todayRevenue: '₽67,500',
			monthRevenue: '₽1,250,000',
			occupancy: 85,
			status: 'active',
			services: ['Парикмахерские', 'Маникюр', 'Косметология'],
		},
		{
			id: 2,
			name: 'Tattoo & Piercing Studio',
			address: 'ул. Арбат, 28',
			phone: '+7 (495) 234-56-78',
			manager: 'Дмитрий Волков',
			staff: 6,
			rooms: 4,
			todayRevenue: '₽45,000',
			monthRevenue: '₽890,000',
			occupancy: 92,
			status: 'active',
			services: ['Татуировки', 'Пирсинг'],
		},
		{
			id: 3,
			name: 'Laser Beauty Clinic',
			address: 'пр. Мира, 45',
			phone: '+7 (495) 345-67-89',
			manager: 'Анна Сидорова',
			staff: 8,
			rooms: 6,
			todayRevenue: '₽52,300',
			monthRevenue: '₽980,000',
			occupancy: 78,
			status: 'active',
			services: ['Лазерная эпиляция', 'Косметология'],
		},
		{
			id: 4,
			name: 'Barbershop Classic',
			address: 'ул. Покровка, 12',
			phone: '+7 (495) 456-78-90',
			manager: 'Михаил Козлов',
			staff: 5,
			rooms: 3,
			todayRevenue: '₽28,900',
			monthRevenue: '₽560,000',
			occupancy: 95,
			status: 'maintenance',
			services: ['Мужские стрижки', 'Бритье'],
		},
	]
	const statsStudiosList = [
		{ id: 1, icon: Building2, count: '4', name: 'Всего студий' },
		{ id: 2, icon: Users, count: '31', name: 'Всего сотрудников' },
		{ id: 3, icon: DollarSign, count: '$193,700', name: 'Выручка сегодня' },
		{ id: 4, icon: Clock, count: '87%', name: 'Средняя загрузка' },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			<HeaderPages
				description='Управление филиалами и студиями'
				nameButton='Добавить студию'
				title='Студии'
			/>
			<StatsList stats={statsStudiosList} />
			<FiltersPages
				placeholder='Поиск по названию, адресу или менеджеру...'
				type='studio'
			/>
			<StudiosGrid studios={studios} />
		</div>
	)
}
