import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, Scissors, Tag } from 'lucide-react'

export const ServiceStats = ({ services, categories }) => {
	const activeServices = services.filter(s => s.is_active)
	const activeCategories = categories.filter(c => c.is_active)

	const stats = {
		totalServices: activeServices.length,
		totalCategories: activeCategories.length,
		averagePrice:
			activeServices.length > 0
				? Math.round(
						activeServices.reduce(
							(sum, s) => sum + parseFloat(s.base_price || 0),
							0
						) / activeServices.length
				  )
				: 0,
		categorizedServices: activeServices.filter(s => s.category_uuid).length,
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Всего услуг</CardTitle>
					<Scissors className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.totalServices}</div>
					<p className='text-xs text-muted-foreground'>активных услуг</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Категорий</CardTitle>
					<Tag className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.totalCategories}</div>
					<p className='text-xs text-muted-foreground'>активных категорий</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Средняя цена</CardTitle>
					<span className='text-xs text-muted-foreground'>$</span>
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.averagePrice} $</div>
					<p className='text-xs text-muted-foreground'>средняя стоимость</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>С категориями</CardTitle>
					<Folder className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.categorizedServices}</div>
					<p className='text-xs text-muted-foreground'>
						{stats.totalServices > 0
							? Math.round(
									(stats.categorizedServices / stats.totalServices) * 100
							  )
							: 0}
						% услуг с категориями
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
