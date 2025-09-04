import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors } from 'lucide-react'
import React from 'react'

export const DashboardServicesCard = ({ services }) => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Популярные услуги
					<div className='flex items-center gap-2'>
						<Button variant='ghost' size='sm' className='text-xs'>
							Сегодня
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Неделя
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Месяц
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{services.map((service, index) => (
					<div
						key={index}
						className='flex items-center justify-between p-4 bg-muted/50 rounded-lg'
					>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
								<Scissors className='h-4 w-4 text-primary-foreground' />
							</div>
							<div>
								<p className='font-medium text-foreground'>{service.name}</p>
								<p className='text-sm text-muted-foreground'>
									{service.bookings} записей • {service.revenue}
								</p>
							</div>
						</div>
						<Badge className='bg-secondary text-secondary-foreground'>
							{service.status}
						</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
