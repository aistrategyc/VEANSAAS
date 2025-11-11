import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
export const CategoryList = ({ categories, onEdit }) => {
	if (categories.items?.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Категории не найдены</CardTitle>
					<CardDescription>
						Попробуйте изменить параметры поиска или добавьте новую категорию
					</CardDescription>
				</CardHeader>
			</Card>
		)
	}
	console.log(categories)
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{categories.items?.map(category => {
				return (
					<Card
						className='cursor-pointer hover:shadow-md transition-shadow'
						key={category?.uuid}
					>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-2'>
									<CardTitle className='text-lg'>{category?.name}</CardTitle>
								</div>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onEdit(category)}
								>
									Изменить
								</Button>
							</div>
							{category?.description && (
								<CardDescription>{category?.description}</CardDescription>
							)}
						</CardHeader>
						<CardContent>
							<div className='flex items-center justify-between'>
								<Badge variant='secondary'>1 услуг</Badge>
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
