import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export const CalendarMastersInfo = () => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground text-lg'>Мастера</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				{[
					{ name: 'Елена К.', appointments: 8, status: 'active' },
					{ name: 'Ольга М.', appointments: 6, status: 'active' },
					{ name: 'Дмитрий В.', appointments: 3, status: 'active' },
					{ name: 'Анна Л.', appointments: 4, status: 'break' },
				].map((master, index) => (
					<div
						key={index}
						className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/20'
					>
						<div className='flex items-center gap-2'>
							<div
								className={`w-2 h-2 rounded-full ${
									master.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
								}`}
							/>
							<span className='text-sm font-medium text-foreground'>
								{master.name}
							</span>
						</div>
						<span className='text-sm text-muted-foreground'>
							{master.appointments} записей
						</span>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
