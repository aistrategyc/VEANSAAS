import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Filter, Search } from 'lucide-react'
import { useState } from 'react'

export const FiltersPages = ({
	placeholder = 'Поиск....',
	type = null,
	onSearch,
}) => {
	const [searchValue, setSearchValue] = useState('')

	const handleSearchChange = e => {
		const value = e.target.value
		setSearchValue(value)
		onSearch(value)
	}

	return (
		<Card className='bg-card border-border'>
			<CardContent className='pt-6'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder={placeholder}
							className='pl-10'
							value={searchValue}
							onChange={handleSearchChange}
						/>
					</div>
					<Button variant='outline'>
						<Filter className='h-4 w-4 mr-2' />
						Фильтры
					</Button>
					{type == 'appointments' && (
						<Button variant='outline'>
							<Calendar className='h-4 w-4 mr-2' />
							Сегодня
						</Button>
					)}
					{type == 'service' ? (
						<Button variant='outline'>Цена</Button>
					) : (
						type == 'inventory' && <Button variant='outline'>Статус</Button>
					)}
					{type == 'finances' && (
						<>
							<Button variant='outline'>Период</Button>
							<Button variant='outline'>Категория</Button>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
