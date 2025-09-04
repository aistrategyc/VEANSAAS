import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const DashboardFinancesCard = () => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Выручка
					<div className='flex gap-1'>
						<Button variant='ghost' size='sm' className='w-6 h-6 p-0'>
							←
						</Button>
						<Button variant='ghost' size='sm' className='w-6 h-6 p-0'>
							→
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div>
						<p className='text-sm text-muted-foreground'>Выручка за месяц</p>
						<p className='text-2xl font-bold'>€18,900</p>
						<p className='text-sm text-muted-foreground'>
							Рост: <span className='text-green-500'>+12.5%</span>
						</p>
					</div>
					<div className='chart-container h-32'>
						<div className='w-full h-full bg-gradient-to-t from-primary/20 to-transparent rounded flex items-end'>
							<div className='text-xs text-muted-foreground mx-auto'>
								График выручки
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
