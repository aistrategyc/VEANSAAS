import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { ClientList } from '@/features/clients/ClientList'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { Calendar, Star, Users } from 'lucide-react'

export default function ClientsPage() {
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
			<ClientList />
		</div>
	)
}
