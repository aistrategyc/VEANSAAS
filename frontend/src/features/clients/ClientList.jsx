import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientItem } from './ClientItem'

export const ClientList = ({ clients }) => {
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
							services={client.services}
							notes={client.notes}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
