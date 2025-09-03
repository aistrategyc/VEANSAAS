import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Edit, Eye, MoreHorizontal, Plus } from 'lucide-react'
import React from 'react'

export const TodayAppointments = ({ todayAppointments }) => {
	return (
		<Card className='lg:col-span-2 bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Clock className='h-5 w-5 text-primary' />
					Записи на сегодня
				</CardTitle>
				<div className='flex gap-2'>
					<Button
						size='sm'
						variant='outline'
						className='hover:scale-105 transition-all duration-200 bg-transparent'
					>
						<Plus className='h-4 w-4' />
					</Button>
					<Button
						size='sm'
						variant='outline'
						className='hover:scale-105 transition-all duration-200 bg-transparent'
					>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{todayAppointments.map((appointment, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.02] group'
						>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2'>
									<div
										className={`w-2 h-8 rounded-full ${
											appointment.priority === 'high'
												? 'bg-red-500'
												: appointment.priority === 'medium'
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
									/>
									<Clock className='h-4 w-4 text-muted-foreground' />
									<span className='font-medium text-foreground'>
										{appointment.time}
									</span>
								</div>
								<div>
									<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
										{appointment.client}
									</p>
									<p className='text-sm text-muted-foreground'>
										{appointment.service}
									</p>
									<div className='flex items-center gap-2 text-xs text-muted-foreground mt-1'>
										<span>Мастер: {appointment.master}</span>
										<span>•</span>
										<span>{appointment.duration}</span>
										<span>•</span>
										<span className='font-medium text-primary'>
											{appointment.price}
										</span>
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Badge
									variant={
										appointment.status === 'confirmed'
											? 'default'
											: appointment.status === 'in-progress'
											? 'secondary'
											: 'outline'
									}
									className={`transition-all duration-200 ${
										appointment.status === 'in-progress' ? 'animate-pulse' : ''
									}`}
								>
									{appointment.status === 'confirmed'
										? 'Подтверждено'
										: appointment.status === 'in-progress'
										? 'В процессе'
										: 'Ожидает'}
								</Badge>
								<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 hover:bg-primary/10'
									>
										<Eye className='h-3 w-3' />
									</Button>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 hover:bg-primary/10'
									>
										<Edit className='h-3 w-3' />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
