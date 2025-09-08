import React from 'react'
import { AnalyticsMastersItem } from './AnalyticsMastersItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export const AnalyticsMasters = ({ masterPerformance }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Users className='h-5 w-5 text-primary' />
					Эффективность мастеров
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{masterPerformance.map((master, index) => (
						<AnalyticsMastersItem
							key={index}
							id={index}
							bookings={master.bookings}
							efficiency={master.efficiency}
							growth={master.growth}
							name={master.name}
							rating={master.rating}
							revenue={master.revenue}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
