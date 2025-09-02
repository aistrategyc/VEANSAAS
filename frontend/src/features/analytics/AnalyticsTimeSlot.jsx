import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { AnalyticsTimeSlotItem } from './AnalyticsTimeSlotItem'

export const AnalyticsTimeSlot = ({ timeSlotAnalytics }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Clock className='h-5 w-5 text-primary' />
					Загрузка по времени
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{timeSlotAnalytics.map((slot, index) => (
						<AnalyticsTimeSlotItem
							key={index}
							id={index}
							bookings={slot.bookings}
							occupancy={slot.occupancy}
							time={slot.time}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
