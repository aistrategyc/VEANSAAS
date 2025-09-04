import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export const CalendarStats = () => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground text-lg'>Сегодня</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>Записей</span>
					<span className='font-medium text-foreground'>24</span>
				</div>
				<div className='flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>Выручка</span>
					<span className='font-medium text-foreground'>€1,230</span>
				</div>
				<div className='flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>Предоплаты</span>
					<span className='font-medium text-foreground'>€285</span>
				</div>
				<div className='flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>
						Свободных слотов
					</span>
					<span className='font-medium text-foreground'>8</span>
				</div>
			</CardContent>
		</Card>
	)
}
