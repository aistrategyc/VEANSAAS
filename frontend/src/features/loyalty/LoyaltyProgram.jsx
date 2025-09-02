import React from 'react'
import { LoyaltyProgramItem } from './LoyaltyProgramItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

export const LoyaltyProgram = ({ loyaltyPrograms }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Star className='h-5 w-5 text-primary' />
					Программы лояльности
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{loyaltyPrograms.map(program => (
						<LoyaltyProgramItem
							key={program.id}
							activeMembers={program.activeMembers}
							description={program.description}
							discount={program.description}
							id={program.id}
							members={program.members}
							minSpend={program.minSpend}
							name={program.name}
							totalRevenue={program.totalRevenue}
							type={program.type}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
