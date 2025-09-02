import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Edit, Euro, Eye, User } from 'lucide-react'
export const CalendarScheduleItem = ({ time, appointments = [] }) => {
	const getAppointmentForTimeSlot = time => {
		return appointments.find(
			apt => apt.time === time && apt.date === '2024-01-15'
		)
	}

	const getAppointmentHeight = duration => {
		return Math.max(1, Math.ceil(duration / 30)) * 60 // 60px per 30min slot
	}
	const appointment = getAppointmentForTimeSlot(time)

	return (
		<div className='relative'>
			<div className='flex items-center border-b border-border/50 min-h-[60px]'>
				<div className='w-16 text-sm text-muted-foreground font-medium'>
					{time}
				</div>
				<div className='flex-1 pl-4'>
					{appointment && (
						<div
							className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
								appointment.status === 'confirmed'
									? 'bg-blue-500/10 border-l-blue-500'
									: appointment.status === 'in-progress'
									? 'bg-green-500/10 border-l-green-500'
									: 'bg-yellow-500/10 border-l-yellow-500'
							}`}
							style={{
								height: `${getAppointmentHeight(appointment.duration)}px`,
							}}
						>
							<div className='flex items-start justify-between'>
								<div className='flex-1'>
									<p className='font-medium text-foreground'>
										{appointment.client}
									</p>
									<p className='text-sm text-muted-foreground'>
										{appointment.service}
									</p>
									<div className='flex items-center gap-2 mt-1'>
										<Badge variant='outline' className='text-xs'>
											<User className='h-3 w-3 mr-1' />
											{appointment.master}
										</Badge>
										<Badge variant='outline' className='text-xs'>
											<Clock className='h-3 w-3 mr-1' />
											{appointment.duration}мин
										</Badge>
										<Badge variant='outline' className='text-xs'>
											<Euro className='h-3 w-3 mr-1' />
											{appointment.price}
										</Badge>
									</div>
									{appointment.prepaid > 0 && (
										<div className='mt-2'>
											<Badge variant='secondary' className='text-xs'>
												Предоплата: €{appointment.prepaid}
											</Badge>
										</div>
									)}
								</div>
								<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
									<Button size='sm' variant='ghost' className='h-6 w-6 p-0'>
										<Eye className='h-3 w-3' />
									</Button>
									<Button size='sm' variant='ghost' className='h-6 w-6 p-0'>
										<Edit className='h-3 w-3' />
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
