import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown } from 'lucide-react'
import { LoyaltyClientsItem } from './LoyaltyClientsItem'

export const LoyaltyClients = ({ topClients }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Crown className='h-5 w-5 text-yellow-500' />
					Топ клиенты программ лояльности
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{topClients.map((client, index) => (
						<LoyaltyClientsItem
							key={client.id}
							index={index}
							bonuses={client.bonuses}
							id={client.id}
							lastVisit={client.lastVisit}
							name={client.name}
							program={client.program}
							tier={client.tier}
							totalSpent={client.totalSpent}
							visits={client.visits}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
