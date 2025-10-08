import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Edit, Eye, Trash2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

export const AppointmentsItem = ({
	id,
	time,
	date,
	client,
	phone,
	service,
	master,
	notes,
	price,
	duration,
	prepaid = null,
	status,
}) => {
	return (
		<div className='flex items-center flex-wrap justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 group'>
			<div className='flex items-center flex-wrap gap-4 max-md:text-sm'>
				<div className='flex items-center gap-2'>
					<Clock className='h-4 w-4 text-muted-foreground' />
					<div>
						<p className='font-medium text-foreground'>{time}</p>
						<p className='text-xs text-muted-foreground'>{date}</p>
					</div>
				</div>
				<div className='flex-1'>
					<p className='font-medium text-foreground'>{client}</p>
					<p className='text-sm text-muted-foreground'>{phone}</p>
				</div>
				<div>
					<p className='font-medium text-foreground'>{service}</p>
					<p className='text-sm text-muted-foreground'>Мастер: {master}</p>
					{notes && (
						<p className='text-xs text-muted-foreground mt-1'>💬 {notes}</p>
					)}
				</div>
				<div className='text-right'>
					<p className='font-medium text-foreground'>{price}</p>
					<p className='text-sm text-muted-foreground'>{duration}</p>
					{prepaid !== '€0' && (
						<Badge variant='secondary' className='text-xs mt-1'>
							Предоплата: {prepaid}
						</Badge>
					)}
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-3 max-md:mt-3'>
				<Badge
					variant={
						status === 'confirmed'
							? 'default'
							: status === 'in-progress'
							? 'secondary'
							: 'outline'
					}
				>
					{status === 'confirmed'
						? 'Подтверждено'
						: status === 'in-progress'
						? 'В процессе'
						: 'Ожидает'}
				</Badge>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost'>
						<Link to='/records/1'>
							<Eye className='h-4 w-4' />
						</Link>
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
