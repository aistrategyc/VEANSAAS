import React from 'react'
import { ServicesItem } from './ServicesItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const ServicesList = ({ services }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>Список услуг</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{services.map(service => (
						<ServicesItem
							key={service.id}
							id={service.id}
							name={service.name}
							bookingsThisMonth={service.bookingsThisMonth}
							category={service.category}
							description={service.description}
							duration={service.duration}
							price={service.price}
							revenue={service.revenue}
							status={service.status}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
