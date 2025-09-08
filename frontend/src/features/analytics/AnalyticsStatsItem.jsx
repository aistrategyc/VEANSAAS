import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
export const AnalyticsStatsItem = ({
	title,
	value,
	id,
	description,
	trend,
	change,
}) => {
	return (
		<Card className='bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105'>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-muted-foreground'>{title}</p>
						<p className='text-2xl font-bold text-card-foreground'>{value}</p>
						<p className='text-xs text-muted-foreground mt-1'>{description}</p>
					</div>
					<div className='text-right'>
						<div
							className={`flex items-center gap-1 ${
								trend === 'up' ? 'text-green-500' : 'text-red-500'
							}`}
						>
							<TrendingUp
								className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`}
							/>
							<span className='text-sm font-medium'>{change}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
