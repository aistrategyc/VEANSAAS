import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
import React from 'react'

export const MainStats = () => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
			<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-card-foreground'>
						Записи сегодня
					</CardTitle>
					<Calendar className='h-4 w-4 text-blue-500' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-card-foreground'>24</div>
					<div className='flex items-center text-xs'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+12%</span>
						<span className='text-muted-foreground ml-1'>от вчера</span>
					</div>
				</CardContent>
			</Card>

			<Card className='bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-card-foreground'>
						Активные клиенты
					</CardTitle>
					<Users className='h-4 w-4 text-green-500' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-card-foreground'>1,247</div>
					<div className='flex items-center text-xs'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+8%</span>
						<span className='text-muted-foreground ml-1'>за месяц</span>
					</div>
				</CardContent>
			</Card>

			<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-card-foreground'>
						Выручка за день
					</CardTitle>
					<DollarSign className='h-4 w-4 text-purple-500' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-card-foreground'>€1,230</div>
					<div className='flex items-center text-xs'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+15%</span>
						<span className='text-muted-foreground ml-1'>от вчера</span>
					</div>
				</CardContent>
			</Card>

			<Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-card-foreground'>
						Средний чек
					</CardTitle>
					<TrendingUp className='h-4 w-4 text-orange-500' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-card-foreground'>€51</div>
					<div className='flex items-center text-xs'>
						<ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
						<span className='text-green-500'>+3%</span>
						<span className='text-muted-foreground ml-1'>за неделю</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
