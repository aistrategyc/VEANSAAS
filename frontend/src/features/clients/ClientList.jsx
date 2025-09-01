import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientItem } from './ClientItem'

export const ClientList = () => {
	const clients = [
		{
			id: 1,
			name: 'Анна Петрова',
			phone: '+7 (999) 123-45-67',
			email: 'anna.petrova@email.com',
			lastVisit: '2024-01-10',
			totalVisits: 15,
			totalSpent: '$67,500',
			status: 'vip',
			nextAppointment: '2024-01-15 09:00',
		},
		{
			id: 2,
			name: 'Мария Сидорова',
			phone: '+7 (999) 234-56-78',
			email: 'maria.sidorova@email.com',
			lastVisit: '2024-01-08',
			totalVisits: 8,
			totalSpent: '$24,000',
			status: 'regular',
			nextAppointment: '2024-01-15 10:30',
		},
		{
			id: 3,
			name: 'Екатерина Иванова',
			phone: '+7 (999) 345-67-89',
			email: 'ekaterina.ivanova@email.com',
			lastVisit: '2024-01-05',
			totalVisits: 3,
			totalSpent: '$45,000',
			status: 'new',
			nextAppointment: '2024-01-15 12:00',
		},
		{
			id: 4,
			name: 'Светлана Козлова',
			phone: '+7 (999) 456-78-90',
			email: 'svetlana.kozlova@email.com',
			lastVisit: '2023-12-20',
			totalVisits: 12,
			totalSpent: '$36,000',
			status: 'inactive',
			nextAppointment: null,
		},
	]
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>Список клиентов</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{clients.map(client => (
						<ClientItem
							key={client.id}
							id={client.id}
							name={client.name}
							phone={client.phone}
							email={client.email}
							totalVisits={client.totalVisits}
							totalSpent={client.totalSpent}
							status={client.status}
							lastVisit={client.lastVisit}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
