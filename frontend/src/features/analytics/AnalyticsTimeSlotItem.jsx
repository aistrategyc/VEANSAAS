import { Clock } from 'lucide-react'

export const AnalyticsTimeSlotItem = ({ id, time, bookings, occupancy }) => {
	return (
		<div className='flex items-center justify-between p-3 rounded-lg bg-muted/20'>
			<div className='flex items-center gap-3'>
				<Clock className='h-4 w-4 text-muted-foreground' />
				<span className='font-medium text-foreground'>{time}</span>
			</div>
			<div className='flex items-center gap-4'>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{bookings}</p>
					<p className='text-xs text-muted-foreground'>Записей</p>
				</div>
				<div className='text-center'>
					<p
						className={`font-medium ${
							occupancy >= 90
								? 'text-green-500'
								: occupancy >= 70
								? 'text-yellow-500'
								: 'text-red-500'
						}`}
					>
						{occupancy}%
					</p>
					<p className='text-xs text-muted-foreground'>Загрузка</p>
				</div>
			</div>
		</div>
	)
}
