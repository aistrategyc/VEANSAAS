// components/Filters.jsx
import React from 'react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const Filters = ({
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	categories = [],
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Поиск и фильтры</CardTitle>
				<CardDescription>
					Найдите нужные услуги по различным критериям
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='flex-1'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Поиск по названию или описанию...'
								value={searchQuery}
								onChange={onSearchChange}
								className='pl-10'
							/>
						</div>
					</div>
					<Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Все категории' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Все категории</SelectItem>
							{categories.map(category => (
								<SelectItem key={category.uuid} value={category.uuid}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	)
}
