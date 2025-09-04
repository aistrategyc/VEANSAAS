import { Badge } from '@/components/ui/badge'
import { ArrowDownRight, ArrowUpRight, CreditCard } from 'lucide-react'
import React from 'react'

export const FinancesTransactionsItem = ({
	id,
	type,
	description,
	category,
	date,
	method,
	amount,
	status,
}) => {
	return (
		<div className='flex flex-wrap items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'>
			<div className='flex items-center gap-4'>
				<div
					className={`w-12 h-12 rounded-lg flex items-center justify-center ${
						type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
					}`}
				>
					{type === 'income' ? (
						<ArrowUpRight className='h-5 w-5 text-green-500' />
					) : (
						<ArrowDownRight className='h-5 w-5 text-red-500' />
					)}
				</div>
				<div>
					<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
						{description}
					</p>
					<p className='text-sm text-muted-foreground'>{category}</p>
					<p className='text-xs text-muted-foreground'>{date}</p>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-6  max-md:mt-3'>
				<div className='text-center'>
					<div className='flex items-center gap-1'>
						<CreditCard className='h-4 w-4 text-muted-foreground' />
						<span className='text-sm text-muted-foreground'>{method}</span>
					</div>
				</div>
				<div className='text-right'>
					<p
						className={`font-medium text-lg ${
							type === 'income' ? 'text-green-500' : 'text-red-500'
						}`}
					>
						{type === 'income' ? '+' : '-'}
						{amount}
					</p>
				</div>
				<Badge
					variant={status === 'completed' ? 'default' : 'secondary'}
					className={
						status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''
					}
				>
					{status === 'completed' ? 'Завершено' : 'В обработке'}
				</Badge>
			</div>
		</div>
	)
}
