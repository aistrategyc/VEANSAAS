import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import React from 'react'

export const LoyaltyClientsItem = ({
	id,
	index,
	name,
	program,
	totalSpent,
	visits,
	bonuses,
	lastVisit,
	tier,
}) => {
	return (
		<div className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'>
			<div className='flex items-center gap-4'>
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
						tier === 'platinum'
							? 'bg-gray-300 text-gray-800'
							: tier === 'gold'
							? 'bg-yellow-400 text-yellow-900'
							: tier === 'silver'
							? 'bg-gray-400 text-gray-900'
							: 'bg-orange-400 text-orange-900'
					}`}
				>
					{index + 1}
				</div>
				<div>
					<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
						{name}
					</p>
					<p className='text-sm text-muted-foreground'>{program}</p>
				</div>
			</div>
			<div className='flex items-center gap-6'>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{totalSpent}</p>
					<p className='text-xs text-muted-foreground'>Потрачено</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{visits}</p>
					<p className='text-xs text-muted-foreground'>Визитов</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{bonuses}</p>
					<p className='text-xs text-muted-foreground'>Бонусы</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{lastVisit}</p>
					<p className='text-xs text-muted-foreground'>Последний визит</p>
				</div>
				<Badge
					variant='outline'
					className={
						tier === 'platinum'
							? 'border-gray-400 text-gray-400'
							: tier === 'gold'
							? 'border-yellow-500 text-yellow-500'
							: tier === 'silver'
							? 'border-gray-500 text-gray-500'
							: 'border-orange-500 text-orange-500'
					}
				>
					{tier === 'platinum'
						? 'Платина'
						: tier === 'gold'
						? 'Золото'
						: tier === 'silver'
						? 'Серебро'
						: 'Бронза'}
				</Badge>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Edit className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
