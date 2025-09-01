import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Package,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	AlertTriangle,
	TrendingDown,
	TrendingUp,
} from 'lucide-react'

export default function InventoryPage() {
	const inventory = [
		{
			id: 1,
			name: "Шампунь профессиональный L'Oreal",
			category: 'Парикмахерские средства',
			currentStock: 15,
			minStock: 10,
			maxStock: 50,
			unit: 'шт',
			price: '₽1,200',
			supplier: 'Beauty Supply Co',
			lastRestocked: '2024-01-10',
			status: 'in-stock',
			monthlyUsage: 8,
		},
		{
			id: 2,
			name: 'Гель-лак OPI',
			category: 'Ногтевые материалы',
			currentStock: 5,
			minStock: 15,
			maxStock: 100,
			unit: 'шт',
			price: '₽850',
			supplier: 'Nail Pro',
			lastRestocked: '2024-01-05',
			status: 'low-stock',
			monthlyUsage: 12,
		},
		{
			id: 3,
			name: 'Тату-краска Intenze',
			category: 'Тату материалы',
			currentStock: 25,
			minStock: 5,
			maxStock: 30,
			unit: 'мл',
			price: '₽2,500',
			supplier: 'Tattoo Supplies',
			lastRestocked: '2024-01-08',
			status: 'in-stock',
			monthlyUsage: 3,
		},
		{
			id: 4,
			name: 'Иглы для пирсинга стерильные',
			category: 'Пирсинг материалы',
			currentStock: 0,
			minStock: 20,
			maxStock: 100,
			unit: 'шт',
			price: '₽150',
			supplier: 'Medical Supply',
			lastRestocked: '2023-12-28',
			status: 'out-of-stock',
			monthlyUsage: 15,
		},
		{
			id: 5,
			name: 'Лазерный гель охлаждающий',
			category: 'Лазерные процедуры',
			currentStock: 8,
			minStock: 5,
			maxStock: 20,
			unit: 'л',
			price: '₽3,200',
			supplier: 'Laser Tech',
			lastRestocked: '2024-01-12',
			status: 'in-stock',
			monthlyUsage: 4,
		},
	]

	const categories = [
		{ name: 'Парикмахерские средства', count: 24, color: 'bg-blue-500' },
		{ name: 'Ногтевые материалы', count: 18, color: 'bg-pink-500' },
		{ name: 'Тату материалы', count: 12, color: 'bg-purple-500' },
		{ name: 'Пирсинг материалы', count: 8, color: 'bg-green-500' },
		{ name: 'Лазерные процедуры', count: 6, color: 'bg-orange-500' },
		{ name: 'Расходные материалы', count: 15, color: 'bg-teal-500' },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Склад</h1>
					<p className='text-muted-foreground'>Управление товарными запасами</p>
				</div>
				<Button className='bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105'>
					<Plus className='h-4 w-4 mr-2' />
					Добавить товар
				</Button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<Package className='h-4 w-4 text-blue-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>83</p>
								<p className='text-sm text-muted-foreground'>Всего товаров</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<AlertTriangle className='h-4 w-4 text-red-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>7</p>
								<p className='text-sm text-muted-foreground'>Заканчиваются</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<TrendingDown className='h-4 w-4 text-orange-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>3</p>
								<p className='text-sm text-muted-foreground'>Закончились</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
					<CardContent className='pt-6'>
						<div className='flex items-center gap-2'>
							<TrendingUp className='h-4 w-4 text-purple-500' />
							<div>
								<p className='text-2xl font-bold text-card-foreground'>
									₽245,600
								</p>
								<p className='text-sm text-muted-foreground'>
									Стоимость запасов
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Categories */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>
						Категории товаров
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{categories.map((category, index) => (
							<div
								key={index}
								className='flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 cursor-pointer'
							>
								<div className={`w-3 h-3 rounded-full ${category.color}`} />
								<div>
									<p className='font-medium text-foreground text-sm'>
										{category.name}
									</p>
									<p className='text-xs text-muted-foreground'>
										{category.count} товаров
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Filters */}
			<Card className='bg-card border-border'>
				<CardContent className='pt-6'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input placeholder='Поиск товаров...' className='pl-10' />
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Категория
						</Button>
						<Button variant='outline'>Статус</Button>
					</div>
				</CardContent>
			</Card>

			{/* Inventory Table */}
			<Card className='bg-card border-border'>
				<CardHeader>
					<CardTitle className='text-card-foreground'>Список товаров</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{inventory.map(item => (
							<div
								key={item.id}
								className='flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] group'
							>
								<div className='flex items-center gap-4'>
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center ${
											item.status === 'out-of-stock'
												? 'bg-red-500/20'
												: item.status === 'low-stock'
												? 'bg-yellow-500/20'
												: 'bg-green-500/20'
										}`}
									>
										<Package
											className={`h-5 w-5 ${
												item.status === 'out-of-stock'
													? 'text-red-500'
													: item.status === 'low-stock'
													? 'text-yellow-500'
													: 'text-green-500'
											}`}
										/>
									</div>
									<div>
										<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
											{item.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{item.category}
										</p>
										<p className='text-xs text-muted-foreground'>
											Поставщик: {item.supplier}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-center'>
										<p
											className={`font-medium ${
												item.currentStock === 0
													? 'text-red-500'
													: item.currentStock <= item.minStock
													? 'text-yellow-500'
													: 'text-foreground'
											}`}
										>
											{item.currentStock} {item.unit}
										</p>
										<p className='text-xs text-muted-foreground'>В наличии</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{item.minStock} {item.unit}
										</p>
										<p className='text-xs text-muted-foreground'>Минимум</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>{item.price}</p>
										<p className='text-xs text-muted-foreground'>Цена</p>
									</div>
									<div className='text-center'>
										<p className='font-medium text-foreground'>
											{item.lastRestocked}
										</p>
										<p className='text-xs text-muted-foreground'>
											Последнее пополнение
										</p>
									</div>
									<Badge
										variant={
											item.status === 'in-stock'
												? 'default'
												: item.status === 'low-stock'
												? 'secondary'
												: 'destructive'
										}
										className={
											item.status === 'low-stock'
												? 'bg-yellow-500/20 text-yellow-500'
												: ''
										}
									>
										{item.status === 'in-stock'
											? 'В наличии'
											: item.status === 'low-stock'
											? 'Заканчивается'
											: 'Закончился'}
									</Badge>
									<div className='flex items-center gap-1'>
										<Button
											size='sm'
											variant='ghost'
											className='hover:bg-primary/10'
										>
											<Eye className='h-4 w-4' />
										</Button>
										<Button
											size='sm'
											variant='ghost'
											className='hover:bg-primary/10'
										>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											size='sm'
											variant='ghost'
											className='hover:bg-destructive/10'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
