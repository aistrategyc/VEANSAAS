import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	className,
}) {
	return (
		<Card className={cn('', className)}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium text-muted-foreground'>
					{title}
				</CardTitle>
				<Icon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				{description && (
					<p className='text-xs text-muted-foreground mt-1'>{description}</p>
				)}
				{trend && (
					<div className='flex items-center mt-2'>
						<span
							className={cn(
								'text-xs font-medium',
								trend.isPositive ? 'text-green-600' : 'text-red-600'
							)}
						>
							{trend.isPositive ? '+' : ''}
							{trend.value}%
						</span>
						<span className='text-xs text-muted-foreground ml-1'>
							{trend.label}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
