import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'

export const FiltersPages = () => {
	return (
		<Card className='bg-card border-border'>
			<CardContent className='pt-6'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Поиск по имени, телефону или email...'
							className='pl-10'
						/>
					</div>
					<Button variant='outline'>
						<Filter className='h-4 w-4 mr-2' />
						Фильтры
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
