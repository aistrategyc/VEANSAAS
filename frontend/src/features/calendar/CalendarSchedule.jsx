import React from 'react'
import { CalendarScheduleItem } from './CalendarScheduleItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export const CalendarSchedule = ({ appointment }) => {
	const timeSlots = Array.from({ length: 20 }, (_, i) => {
		const hour = Math.floor(i / 2) + 9
		const minute = i % 2 === 0 ? '00' : '30'
		return `${hour.toString().padStart(2, '0')}:${minute}`
	})
	console.log(appointment)
	return (
		<div className='lg:col-span-3'>
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<Clock className='h-5 w-5 text-primary' />
						Расписание на день
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='relative'>
						{/* Time slots */}
						<div className='space-y-0'>
							{timeSlots.map((time, index) => (
								<CalendarScheduleItem
									key={index}
									time={time}
									appointments={appointment}
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
