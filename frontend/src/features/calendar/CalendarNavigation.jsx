import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const CalendarNavigation = () => {
	return (
		<Card className='bg-card border-border'>
			<CardContent className='pt-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<Button variant='outline' size='sm'>
							<ChevronLeft className='h-4 w-4' />
						</Button>
						<h2 className='text-xl font-semibold text-foreground'>
							15 января 2024
						</h2>
						<Button variant='outline' size='sm'>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>
					<div className='flex gap-2'>
						<Button variant='outline' size='sm'>
							День
						</Button>
						<Button variant='outline' size='sm'>
							Неделя
						</Button>
						<Button variant='outline' size='sm'>
							Месяц
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
