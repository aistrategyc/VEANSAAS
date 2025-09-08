import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

export const DashboardStaffCard = () => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Топ мастера
					<Button variant='ghost' size='sm' className='text-xs'>
						За месяц
					</Button>
				</CardTitle>
				<p className='text-sm text-muted-foreground'>Лучшие по рейтингу</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-3'>
					<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center'>
								<Star className='h-4 w-4 text-yellow-500 fill-current' />
							</div>
							<div>
								<p className='font-medium text-foreground'>Елена Кузнецова</p>
								<p className='text-xs text-muted-foreground'>Парикмахер</p>
							</div>
						</div>
						<div className='text-right'>
							<p className='font-medium text-foreground'>4.9</p>
							<p className='text-xs text-muted-foreground'>89 отзывов</p>
						</div>
					</div>
					<div className='flex items-center justify-between p-3 bg-muted/20 rounded-lg'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center'>
								<Star className='h-4 w-4 text-purple-500 fill-current' />
							</div>
							<div>
								<p className='font-medium text-foreground'>Дмитрий Волков</p>
								<p className='text-xs text-muted-foreground'>Тату-мастер</p>
							</div>
						</div>
						<div className='text-right'>
							<p className='font-medium text-foreground'>4.9</p>
							<p className='text-xs text-muted-foreground'>45 отзывов</p>
						</div>
					</div>
				</div>
				<div className='flex gap-2'>
					<Button size='sm' className='flex-1 bg-primary hover:bg-primary/90'>
						Подробнее
					</Button>
					<Button size='sm' variant='outline' className='flex-1 bg-transparent'>
						Рейтинги
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
