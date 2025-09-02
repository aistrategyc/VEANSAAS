import React from 'react'

export const FinancesMonthlyChartItem = ({ month, id, income, expenses }) => {
	return (
		<div className='flex items-center justify-between p-3 rounded-lg bg-muted/20'>
			<div className='flex items-center gap-4'>
				<div className='w-12 text-center'>
					<p className='font-medium text-foreground'>{month}</p>
				</div>
				<div className='flex-1'>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<div className='w-3 h-3 rounded-full bg-green-500' />
							<span className='text-sm text-muted-foreground'>Доходы</span>
							<span className='font-medium text-foreground'>
								${income.toLocaleString()}
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<div className='w-3 h-3 rounded-full bg-red-500' />
							<span className='text-sm text-muted-foreground'>Расходы</span>
							<span className='font-medium text-foreground'>
								${expenses.toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='text-right'>
				<p className='font-medium text-foreground'>
					${(income - expenses).toLocaleString()}
				</p>
				<p className='text-xs text-muted-foreground'>Прибыль</p>
			</div>
		</div>
	)
}
