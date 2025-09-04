import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import React from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

export const RevenueChart = ({ revenueData }) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<TrendingUp className='h-5 w-5 text-primary' />
					Выручка за неделю
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width='100%' height={200}>
					<AreaChart data={revenueData}>
						<defs>
							<linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
								<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: '#1f2937',
								border: '1px solid #374151',
								borderRadius: '8px',
							}}
							formatter={value => [`€${value}`, 'Выручка']}
						/>
						<Area
							type='monotone'
							dataKey='revenue'
							stroke='#3b82f6'
							fillOpacity={1}
							fill='url(#colorRevenue)'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}
