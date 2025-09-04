import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export const DashboardAppointmentsCard = ({ appointments }) => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Предстоящие записи
					<div className='flex items-center gap-2'>
						<Button variant='ghost' size='sm' className='text-xs'>
							Сегодня
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Завтра
						</Button>
					</div>
				</CardTitle>
				<p className='text-sm text-muted-foreground'>
					Ближайшие записи клиентов
				</p>
			</CardHeader>
			<CardContent className='space-y-3'>
				{appointments.map((appointment, index) => (
					<div
						key={index}
						className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
					>
						<div className='flex items-center gap-3'>
							<Clock className='h-4 w-4 text-muted-foreground' />
							<div>
								<p className='text-sm font-medium text-foreground'>
									{appointment.client}
								</p>
								<p className='text-xs text-muted-foreground'>
									{appointment.service} • {appointment.time}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<Badge className='bg-secondary text-secondary-foreground text-xs'>
								{appointment.master}
							</Badge>
							<span className='text-sm font-medium text-foreground'>
								{appointment.price}
							</span>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
