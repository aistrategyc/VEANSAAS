import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye, Scissors, Trash2 } from 'lucide-react'
import React from 'react'

export const ServicesItem = ({
	id,
	name,
	category,
	description,
	duration,
	price,
	bookingsThisMonth,
	revenue,
	status = null,
}) => {
	return (
		<div className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
			<div className='flex items-center gap-4'>
				<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center'>
					<Scissors className='h-5 w-5 text-primary' />
				</div>
				<div>
					<p className='font-medium text-foreground'>{name}</p>
					<p className='text-sm text-muted-foreground'>{category}</p>
					<p className='text-xs text-muted-foreground mt-1'>{description}</p>
				</div>
			</div>
			<div className='flex items-center gap-6'>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{duration}</p>
					<p className='text-xs text-muted-foreground'>Длительность</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{price}</p>
					<p className='text-xs text-muted-foreground'>Стоимость</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{bookingsThisMonth}</p>
					<p className='text-xs text-muted-foreground'>Записей за месяц</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{revenue}</p>
					<p className='text-xs text-muted-foreground'>Выручка</p>
				</div>
				<Badge variant='default'>Активна</Badge>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost'>
						<Edit className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost'>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
