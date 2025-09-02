import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Scissors,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Clock,
	DollarSign,
} from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { CategoriesList } from '@/features/categories/CategoriesList'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { ServicesList } from '@/features/services/ServicesList'

export default function ServicesPage() {
	const services = [
		{
			id: 1,
			name: 'Женская стрижка',
			category: 'Парикмахерские услуги',
			duration: '60 мин',
			price: '₽2,500',
			description: 'Стрижка любой сложности с укладкой',
			masters: ['Елена Кузнецова', 'Мария Петрова'],
			bookingsThisMonth: 45,
			revenue: '₽112,500',
			status: 'active',
		},
		{
			id: 2,
			name: 'Окрашивание волос',
			category: 'Парикмахерские услуги',
			duration: '180 мин',
			price: '₽4,500',
			description: 'Окрашивание в один тон или сложные техники',
			masters: ['Елена Кузнецова'],
			bookingsThisMonth: 32,
			revenue: '₽144,000',
			status: 'active',
		},
		{
			id: 3,
			name: 'Маникюр классический',
			category: 'Ногтевой сервис',
			duration: '90 мин',
			price: '₽1,800',
			description: 'Классический маникюр с покрытием гель-лак',
			masters: ['Ольга Морозова', 'Анна Смирнова'],
			bookingsThisMonth: 67,
			revenue: '₽120,600',
			status: 'active',
		},
		{
			id: 4,
			name: 'Татуировка малая',
			category: 'Татуировки',
			duration: '120 мин',
			price: '₽8,000',
			description: 'Татуировка размером до 10x10 см',
			masters: ['Дмитрий Волков'],
			bookingsThisMonth: 15,
			revenue: '₽120,000',
			status: 'active',
		},
		{
			id: 5,
			name: 'Пирсинг уха',
			category: 'Пирсинг',
			duration: '30 мин',
			price: '₽2,000',
			description: 'Прокол мочки или хряща уха с украшением',
			masters: ['Анна Лебедева'],
			bookingsThisMonth: 28,
			revenue: '₽56,000',
			status: 'active',
		},
		{
			id: 6,
			name: 'Лазерная эпиляция ног',
			category: 'Лазерные процедуры',
			duration: '60 мин',
			price: '₽3,500',
			description: 'Лазерная эпиляция ног полностью',
			masters: ['Светлана Козлова'],
			bookingsThisMonth: 22,
			revenue: '₽77,000',
			status: 'active',
		},
	]

	const categories = [
		{ name: 'Парикмахерские услуги', count: 12, color: 'bg-blue-500' },
		{ name: 'Ногтевой сервис', count: 8, color: 'bg-pink-500' },
		{ name: 'Татуировки', count: 6, color: 'bg-purple-500' },
		{ name: 'Пирсинг', count: 4, color: 'bg-green-500' },
		{ name: 'Лазерные процедуры', count: 5, color: 'bg-orange-500' },
		{ name: 'Косметология', count: 7, color: 'bg-teal-500' },
	]
	const statsServicesList = [
		{ id: 1, icon: Scissors, count: '42', name: 'Всего услуг' },
		{ id: 2, icon: Clock, count: 90, name: 'Средняя длительность' },
		{ id: 3, icon: DollarSign, count: '€60', name: 'Средняя стоимость' },
		{ id: 4, count: 209, name: 'Записей за месяц' },
	]

	return (
		<div className='space-y-6'>
			<HeaderPages
				title='Услуги'
				description='Каталог услуг салона'
				nameButton='Добавить услугу'
			/>

			<CategoriesList categories={categories} type='service' />
			<StatsList stats={statsServicesList} />
			<FiltersPages placeholder='Поиск услуг...' type='service' />
			<ServicesList services={services} />
		</div>
	)
}
