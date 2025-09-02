import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
export const AnalyticsMastersItem = ({
	id,
	name,
	bookings,
	rating,
	revenue,
	efficiency,
	growth,
}) => {
	return (
		<div className='flex items-center justify-between p-3 rounded-lg bg-muted/20'>
			<div>
				<p className='font-medium text-foreground'>{name}</p>
				<div className='flex items-center gap-3 text-sm text-muted-foreground'>
					<span>{bookings} записей</span>
					<div className='flex items-center gap-1'>
						<Star className='h-3 w-3 text-yellow-500 fill-current' />
						<span>{rating}</span>
					</div>
				</div>
			</div>
			<div className='text-right'>
				<p className='font-medium text-foreground'>{revenue}</p>
				<div className='flex items-center gap-2'>
					<span className='text-xs text-muted-foreground'>
						{efficiency}% эффективность
					</span>
					<Badge
						variant='outline'
						className='text-green-500 border-green-500 text-xs'
					>
						{growth}
					</Badge>
				</div>
			</div>
		</div>
	)
}
