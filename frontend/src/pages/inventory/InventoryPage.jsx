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
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { CategoriesList } from '@/features/categories/CategoriesList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { InventoryList } from '@/features/inventory/InventoryList'

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
			price: '$1,200',
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
			price: '$850',
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
			price: '$2,500',
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
			price: '$150',
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
			price: '$3,200',
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
	const statsInventoryList = [
		{ id: 1, icon: Package, count: '83', name: 'Всего товаров' },
		{ id: 2, icon: AlertTriangle, count: 7, name: 'Заканчиваются' },
		{ id: 3, icon: TrendingDown, count: '3', name: 'Закончились' },
		{ id: 4, icon: TrendingUp, count: '$1203', name: 'Стоимость запасов' },
	]

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>

			<HeaderPages
				description='Управление товарными запасами'
				nameButton='Добавить товар'
				title='Склад'
			/>
			<StatsList stats={statsInventoryList} />
			<CategoriesList categories={categories} type='inventory' />
			<FiltersPages placeholder='Поиск товаров...' type='inventory' />
			<InventoryList inventories={inventory} />

		</div>
	)
}
