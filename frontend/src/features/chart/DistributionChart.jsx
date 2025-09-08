import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors } from 'lucide-react'
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export const DistributionChart = ({ distributions }) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<Scissors className='h-5 w-5 text-primary' />
					Распределение услуг
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width='100%' height={200}>
					<PieChart>
						<Pie
							data={distributions}
							cx='50%'
							cy='50%'
							innerRadius={40}
							outerRadius={80}
							paddingAngle={5}
							dataKey='value'
						>
							{distributions.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: '#1f2937',
								border: '1px solid #374151',
								borderRadius: '8px',
							}}
							formatter={value => [`${value}%`, 'Доля']}
						/>
					</PieChart>
				</ResponsiveContainer>
				<div className='flex flex-wrap gap-2 mt-4'>
					{distributions.map((item, index) => (
						<div key={index} className='flex items-center gap-1'>
							<div
								className='w-3 h-3 rounded-full'
								style={{ backgroundColor: item.color }}
							/>
							<span className='text-xs text-muted-foreground'>{item.name}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
