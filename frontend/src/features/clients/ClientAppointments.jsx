import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Calendar, Clock } from 'lucide-react'
import React from 'react'

export const ClientAppointments = ({ upcomingAppointments }) => {
	return (
		<TabsContent value='appointments' className='space-y-4'>
			<Card className='crypto-card'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Calendar className='h-5 w-5 text-primary' />
						Предстоящие записи
					</CardTitle>
				</CardHeader>
				<CardContent>
					{upcomingAppointments.length > 0 ? (
						<div className='space-y-4'>
							{upcomingAppointments.map(appointment => (
								<div
									key={appointment.id}
									className='flex items-center justify-between p-4 bg-muted/20 rounded-lg'
								>
									<div className='flex items-center gap-4'>
										<div className='flex flex-col items-center justify-center w-16 h-16 bg-primary/20 rounded-lg'>
											<div className='text-lg font-bold text-primary'>
												{new Date(appointment.date).getDate()}
											</div>
											<div className='text-xs text-muted-foreground'>
												{new Date(appointment.date).toLocaleDateString(
													'ru-RU',
													{
														month: 'short',
													}
												)}
											</div>
										</div>
										<div>
											<h4 className='font-semibold text-card-foreground'>
												{appointment.service}
											</h4>
											<p className='text-sm text-muted-foreground'>
												Мастер: {appointment.master}
											</p>
											<div className='flex items-center gap-2 text-sm text-muted-foreground'>
												<Clock className='h-3 w-3' />
												{appointment.time}
											</div>
										</div>
									</div>
									<div className='text-right'>
										<div className='text-lg font-semibold text-card-foreground'>
											{appointment.price} $
										</div>
										<Badge variant='outline' className='text-xs'>
											Запланировано
										</Badge>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-8 text-muted-foreground'>
							<Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
							<p>Нет предстоящих записей</p>
						</div>
					)}
				</CardContent>
			</Card>
		</TabsContent>
	)
}
