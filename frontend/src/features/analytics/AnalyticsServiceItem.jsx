import { Badge } from '@/components/ui/badge'
import { Star, Target } from 'lucide-react'
export const AnalyticsServiceItem = ({
	service,
	bookings,
	avgPrice,
	revenue,
	satisfaction,
	growth,
	id,
}) => {
	return (
		<div className='flex flex-wrap items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200'>
			<div className='flex items-center gap-4'>
				<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
					<Target className='h-5 w-5 text-primary' />
				</div>
				<div>
					<p className='font-medium text-foreground'>{service}</p>
					<div className='flex items-center gap-4 text-sm text-muted-foreground'>
						<span>{bookings} записей</span>
						<span>Средний чек: {avgPrice}</span>
					</div>
				</div>
			</div>
			<div className='flex items-center gap-6 max-md:mt-3'>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{revenue}</p>
					<p className='text-xs text-muted-foreground'>Выручка</p>
				</div>
				<div className='text-center'>
					<div className='flex items-center gap-1'>
						<Star className='h-3 w-3 text-yellow-500 fill-current' />
						<span className='font-medium text-foreground'>{satisfaction}</span>
					</div>
					<p className='text-xs text-muted-foreground'>Рейтинг</p>
				</div>
				<Badge variant='outline' className='text-green-500 border-green-500'>
					{growth}
				</Badge>
			</div>
		</div>
	)
}
