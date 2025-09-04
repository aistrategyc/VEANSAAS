import { Card, CardContent } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

export const DashboardStats = ({ stats }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
			{stats.map((stat, index) => (
				<Card
					key={index}
					className='crypto-card hover:scale-105 transition-all duration-300'
				>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-3'>
								<div
									className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${stat.color}`}
								>
									<stat.icon className='h-5 w-5' />
								</div>
								<div>
									<h3 className='font-semibold text-foreground'>{stat.name}</h3>
									<p className='text-sm text-muted-foreground'>
										{stat.description}
									</p>
								</div>
							</div>
							<div className='chart-container w-16 h-8'>
								<div className='w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 rounded'></div>
							</div>
						</div>
						<div className='space-y-1'>
							<p className='text-2xl font-bold text-foreground'>{stat.value}</p>
							<div className='flex items-center gap-1'>
								{stat.trend === 'up' ? (
									<TrendingUp className='h-4 w-4 text-green-500' />
								) : (
									<TrendingDown className='h-4 w-4 text-red-500' />
								)}
								<span
									className={`text-sm ${
										stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
									}`}
								>
									{stat.change}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
