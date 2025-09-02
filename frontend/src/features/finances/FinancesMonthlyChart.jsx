import React from 'react'
import { FinancesMonthlyChartItem } from './FinancesMonthlyChartItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export const FinancesMonthlyChart = ({ monthlyStats }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<TrendingUp className='h-5 w-5 text-primary' />
					Динамика доходов и расходов
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{monthlyStats.map((stat, index) => (
						<FinancesMonthlyChartItem
							key={index}
							id={index}
							expenses={stat.expenses}
							income={stat.income}
							month={stat.month}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
