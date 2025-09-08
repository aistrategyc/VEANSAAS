import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const DashboardCalendarCard = () => {
	return (
		<Card className='crypto-card'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					Календарь
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
				<div className='text-center mb-4'>
					<p className='font-semibold'>Январь 2025</p>
				</div>
				<div className='grid grid-cols-7 gap-1 text-xs'>
					<div className='text-center p-1 text-muted-foreground'>Пн</div>
					<div className='text-center p-1 text-muted-foreground'>Вт</div>
					<div className='text-center p-1 text-muted-foreground'>Ср</div>
					<div className='text-center p-1 text-muted-foreground'>Чт</div>
					<div className='text-center p-1 text-muted-foreground'>Пт</div>
					<div className='text-center p-1 text-muted-foreground'>Сб</div>
					<div className='text-center p-1 text-muted-foreground'>Вс</div>
					{Array.from({ length: 31 }, (_, i) => (
						<div
							key={i}
							className={`text-center p-1 rounded ${
								[4, 11, 18, 25].includes(i + 1)
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-muted'
							}`}
						>
							{i + 1}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
