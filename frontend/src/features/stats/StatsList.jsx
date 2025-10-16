import { StatsItem } from './StatsItem'
import { Building2, Users, Clock, DollarSign } from 'lucide-react'

export const StatsList = () => {
	const stats = [
		{
			id: 1,
			icon: Building2,
			count: 0,
			name: 'Всего студий',
		},
		{
			id: 2,
			icon: Users,
			count: 0,
			name: 'Всего сотрудников',
		},
		{ id: 3, icon: DollarSign, count: '$0', name: 'Выручка сегодня' },
		{ id: 4, icon: Clock, count: '0%', name: 'Средняя загрузка' },
	]
	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
			{stats.map(stat => (
				<StatsItem
					key={stat.id}
					name={stat.name}
					count={stat.count}
					Icon={stat.icon}
				/>
			))}
		</div>
	)
}
