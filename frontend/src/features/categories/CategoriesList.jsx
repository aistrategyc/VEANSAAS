import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoriesItem } from './CategoriesItem'

export const CategoriesList = ({ categories, type }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>
					Категории {type === 'service' ? 'услуг' : 'товаров'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
					{categories.map((category, index) => (
						<CategoriesItem
							key={index}
							count={category.count}
							name={category.name}
							type={type}
							color={category.color}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
