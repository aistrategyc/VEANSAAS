import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import {
	Calendar,
	Clock,
	Scissors,
	Sparkles,
	Star,
	TrendingUp,
} from 'lucide-react'
import React from 'react'

export const ClientHistoryAppointments = ({
	appointmentHistory,
	clientData,
}) => {
	return (
		<TabsContent value='history' className='space-y-4'>
			<Card className='crypto-card'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<TrendingUp className='h-5 w-5 text-secondary' />
						История посещений
					</CardTitle>
					<CardDescription>
						Последний визит:{' '}
						{new Date(clientData.lastVisit).toLocaleDateString('ru-RU')}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{appointmentHistory.map(appointment => (
							<div
								key={appointment.id}
								className='flex items-center justify-between p-4 border border-border rounded-lg'
							>
								<div className='flex items-center gap-4'>
									<div className='flex items-center justify-center w-10 h-10 bg-secondary/20 rounded-full'>
										{appointment.service.includes('Стрижка') ? (
											<Scissors className='h-4 w-4 text-secondary' />
										) : (
											<Sparkles className='h-4 w-4 text-secondary' />
										)}
									</div>
									<div>
										<h4 className='font-semibold text-card-foreground'>
											{appointment.service}
										</h4>
										<p className='text-sm text-muted-foreground'>
											Мастер: {appointment.master}
										</p>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<Calendar className='h-3 w-3' />
											{new Date(appointment.date).toLocaleDateString(
												'ru-RU'
											)} в {appointment.time}
										</div>
									</div>
								</div>
								<div className='text-right'>
									<div className='text-lg font-semibold text-card-foreground'>
										{appointment.price} $
									</div>
									<div className='flex items-center gap-1 text-sm text-green-400'>
										<Star className='h-3 w-3 fill-current' />
										Выполнено
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	)
}
