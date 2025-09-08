import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import React from 'react'

export const FinancesStats = () => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
			<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<TrendingUp className='h-4 w-4 text-green-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽650,000
								</p>
								<p className='text-sm text-muted-foreground'>Доходы за месяц</p>
							</div>
						</div>
						<ArrowUpRight className='h-4 w-4 text-green-500' />
					</div>
					<div className='flex items-center text-xs mt-2'>
						<span className='text-green-500'>+12%</span>
						<span className='text-muted-foreground ml-1'>
							от прошлого месяца
						</span>
					</div>
				</CardContent>
			</Card>
			<Card className='bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<TrendingDown className='h-4 w-4 text-red-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽380,000
								</p>
								<p className='text-sm text-muted-foreground'>
									Расходы за месяц
								</p>
							</div>
						</div>
						<ArrowUpRight className='h-4 w-4 text-red-500' />
					</div>
					<div className='flex items-center text-xs mt-2'>
						<span className='text-red-500'>+8%</span>
						<span className='text-muted-foreground ml-1'>
							от прошлого месяца
						</span>
					</div>
				</CardContent>
			</Card>
			<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
				<CardContent className='pt-6'>
					<div className='flex items-center gap-2'>
						<DollarSign className='h-4 w-4 text-blue-500' />
						<div>
							<p className='text-2xl font-bold text-card-foreground'>
								₽270,000
							</p>
							<p className='text-sm text-muted-foreground'>Прибыль за месяц</p>
						</div>
					</div>
					<div className='flex items-center text-xs mt-2'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+18%</span>
						<span className='text-muted-foreground ml-1'>
							от прошлого месяца
						</span>
					</div>
				</CardContent>
			</Card>
			<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
				<CardContent className='pt-6'>
					<div className='flex items-center gap-2'>
						<Wallet className='h-4 w-4 text-purple-500' />
						<div>
							<p className='text-2xl font-bold text-card-foreground'>₽45,230</p>
							<p className='text-sm text-muted-foreground'>Выручка сегодня</p>
						</div>
					</div>
					<div className='flex items-center text-xs mt-2'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+15%</span>
						<span className='text-muted-foreground ml-1'>от вчера</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
