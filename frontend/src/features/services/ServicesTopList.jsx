import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight, Star } from 'lucide-react'
import React from 'react'

export const ServicesTopList = ({ topList }) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Star className='h-5 w-5 text-yellow-500' />
					Популярные услуги
				</CardTitle>
				<Button
					size='sm'
					variant='ghost'
					className='text-primary hover:text-primary/80'
				>
					Все услуги
				</Button>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{topList.map((service, index) => (
						<div
							key={index}
							className='flex flex-wrap items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-all duration-200 group'
						>
							<div className='flex items-center gap-3'>
								<div className={`w-3 h-3 rounded-full ${service.color}`} />
								<div>
									<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
										{service.name}
									</p>
									<p className='text-sm text-muted-foreground'>
										{service.bookings} записей
									</p>
								</div>
							</div>
							<div className='text-right flex items-center gap-2'>
								<div>
									<p className='font-medium text-foreground'>
										{service.revenue}
									</p>
								</div>
								{service.trend === 'up' ? (
									<ArrowUpRight className='h-4 w-4 text-green-500' />
								) : (
									<ArrowDownRight className='h-4 w-4 text-red-500' />
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
