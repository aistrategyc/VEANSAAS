import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import { AnalyticsServiceItem } from './AnalyticsServiceItem'

export const AnalyticsService = ({ serviceAnalytics }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<BarChart3 className='h-5 w-5 text-primary' />
					Аналитика услуг
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{serviceAnalytics.map((service, index) => (
						<AnalyticsServiceItem
							key={index}
							id={index}
							avgPrice={service.avgPrice}
							bookings={service.bookings}
							growth={service.growth}
							revenue={service.revenue}
							satisfaction={service.satisfaction}
							service={service.service}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
