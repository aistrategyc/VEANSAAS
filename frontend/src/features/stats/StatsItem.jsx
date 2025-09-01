import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const StatsItem = ({ Icon = Badge, count = 0, name }) => {
	return (
		<Card className='bg-card border-border'>
			<CardContent className='pt-6'>
				<div className='flex items-center gap-2'>
					<Icon className='h-4 w-4 text-primary p-0' variant='secondary' />
					<div>
						<p className='text-2xl font-bold text-card-foreground'>{count}</p>
						<p className='text-sm text-muted-foreground'>{name}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
