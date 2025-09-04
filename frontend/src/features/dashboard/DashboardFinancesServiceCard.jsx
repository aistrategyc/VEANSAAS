import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const DashboardFinancesServiceCard = () => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Услуги
					<div className='flex gap-2'>
						<Button variant='ghost' size='sm' className='text-xs'>
							Месяц
						</Button>
						<Button variant='ghost' size='sm' className='text-xs'>
							Неделя
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='text-center'>
						<p className='text-2xl font-bold'>€7,496</p>
						<p className='text-sm text-muted-foreground'>
							Средний чек за месяц
						</p>
					</div>
					<div className='flex justify-center gap-4'>
						<div className='text-center'>
							<div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2'>
								<span className='text-primary-foreground font-bold'>41%</span>
							</div>
							<p className='text-xs text-muted-foreground'>Стрижки</p>
						</div>
						<div className='text-center'>
							<div className='w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2'>
								<span className='text-secondary-foreground font-bold'>30%</span>
							</div>
							<p className='text-xs text-muted-foreground'>Маникюр</p>
						</div>
						<div className='text-center'>
							<div className='w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-2'>
								<span className='text-accent-foreground font-bold'>17%</span>
							</div>
							<p className='text-xs text-muted-foreground'>Тату</p>
						</div>
						<div className='text-center'>
							<div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-2'>
								<span className='text-muted-foreground font-bold'>12%</span>
							</div>
							<p className='text-xs text-muted-foreground'>Другое</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
