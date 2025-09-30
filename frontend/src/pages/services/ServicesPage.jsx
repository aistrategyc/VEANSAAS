import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Scissors, Tag } from 'lucide-react'

import { RoleGuard } from '@/components/ui/role-guard'
import { mockServices, mockServiceCategories } from '@/lib/mock-data-services'
import { ServiceModal } from '@/features/services/ServicesModal'
import { CategoryModal } from '@/features/services/CategoryModal'
import { ServicesTable } from '@/features/services/ServicesTable'
import { AttributesManager } from '@/features/services/AttributesManager'
import { api } from '@/shared/api/api'

export default function ServicesPage() {
	const user = {
		id: '1',
		email: 'admin@salon.com',
		name: 'Анна Администратор',
		role: 'Admin',
		organizationId: 'org1',
		isActive: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	}
	const [services, setServices] = useState(mockServices)
	const [categories, setCategories] = useState(mockServiceCategories)
	const [searchQuery, setSearchQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [selectedService, setSelectedService] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

	const [attributes, setAttributes] = useState([])

	const [editingCategory, setEditingCategory] = useState(null)

	useEffect(() => {
		const fetchCategory = async () => {
			const response = await api.get(
				'services/categories',

				{
					headers: {
						'X-Studio-UUID': '084809d3-a2cf-47fb-a069-1e74ab7869b6',
					},
				}
			)
			consol.log(response)
		}

		fetchCategory()
	}, [])
	const handleSaveAttribute = attributeData => {
		setAttributes(prev => {
			const existingIndex = prev.findIndex(attr => attr.id === attributeData.id)
			if (existingIndex >= 0) {
				return prev.map((attr, index) =>
					index === existingIndex ? attributeData : attr
				)
			}
			return [
				...prev,
				{ ...attributeData, id: attributeData.id || Date.now().toString() },
			]
		})
	}

	const handleDeleteAttribute = attributeId => {
		setAttributes(prev => prev.filter(attr => attr.id !== attributeId))
		// Также удалить атрибут из всех категорий
		setCategories(prev =>
			prev.map(category => ({
				...category,
				attributeIds:
					category.attributeIds?.filter(id => id !== attributeId) || [],
			}))
		)
	}

	// Filter services
	const filteredServices = services.filter(service => {
		const matchesSearch =
			searchQuery === '' ||
			service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.description?.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesCategory =
			categoryFilter === 'all' || service.categoryId === categoryFilter

		return matchesSearch && matchesCategory && service.isActive
	})

	const handleCreateService = () => {
		setSelectedService(null)
		setIsServiceModalOpen(true)
	}

	const handleEditService = service => {
		setSelectedService(service)
		setIsServiceModalOpen(true)
	}

	const handleSaveService = serviceData => {
		if (selectedService) {
			setServices(prev =>
				prev.map(service =>
					service.id === selectedService.id
						? { ...service, ...serviceData }
						: service
				)
			)
		} else {
			const newService = {
				id: `serv${Date.now()}`,
				organizationId: 'org1',
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				currency: 'RUB',
				...serviceData,
			}
			setServices(prev => [newService, ...prev])
		}
		setIsServiceModalOpen(false)
		setSelectedService(null)
	}

	const handleDeleteService = serviceId => {
		setServices(prev =>
			prev.map(service =>
				service.id === serviceId ? { ...service, isActive: false } : service
			)
		)
	}

	const handleCreateCategory = () => {
		setSelectedCategory(null)
		setIsCategoryModalOpen(true)
	}

	const handleEditCategory = category => {
		setSelectedCategory(category)
		setIsCategoryModalOpen(true)
	}

	const handleSaveCategory = categoryData => {
		// Ваша логика сохранения категории
		if (editingCategory) {
			setCategories(prev =>
				prev.map(cat =>
					cat.id === editingCategory.id
						? { ...categoryData, id: editingCategory.id }
						: cat
				)
			)
		} else {
			setCategories(prev => [
				...prev,
				{ ...categoryData, id: Date.now().toString() },
			])
		}
		setIsCategoryModalOpen(false)
		setEditingCategory(null)
	}

	const handleDeleteCategory = categoryId => {
		setCategories(prev =>
			prev.map(category =>
				category.id === categoryId ? { ...category, isActive: false } : category
			)
		)
	}

	const stats = {
		totalServices: services.filter(s => s.isActive).length,
		totalCategories: categories.filter(c => c.isActive).length,
		averagePrice: Math.round(
			services.reduce((sum, s) => sum + s.price, 0) / services.length
		),
		averageDuration: Math.round(
			services.reduce((sum, s) => sum + s.duration, 0) / services.length
		),
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Услуги</h1>
					<p className='text-muted-foreground'>
						Управление услугами и категориями салона
					</p>
				</div>

				<div className='flex items-center space-x-2'>
					<Button variant='outline' onClick={handleCreateCategory}>
						<Tag className='h-4 w-4 mr-2' />
						Добавить категорию
					</Button>
					<Button onClick={handleCreateService}>
						<Plus className='h-4 w-4 mr-2' />
						Добавить услугу
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Всего услуг</CardTitle>
						<Scissors className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.totalServices}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Категорий</CardTitle>
						<Tag className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.totalCategories}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Средняя цена</CardTitle>
						<span className='text-xs text-muted-foreground'>₽</span>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats.averagePrice.toLocaleString()} ₽
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Средняя длительность
						</CardTitle>
						<span className='text-xs text-muted-foreground'>мин</span>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats.averageDuration} мин
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue='services' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='services'>Услуги</TabsTrigger>
					<TabsTrigger value='categories'>Категории</TabsTrigger>
				</TabsList>

				<TabsContent value='services' className='space-y-4'>
					{/* Filters */}
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
											onChange={e => setSearchQuery(e.target.value)}
											className='pl-10'
										/>
									</div>
								</div>
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger className='w-[200px]'>
										<SelectValue placeholder='Категория' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Все категории</SelectItem>
										{categories
											.filter(c => c.isActive)
											.map(category => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Services Table */}
					<ServicesTable
						services={filteredServices}
						categories={categories}
						onEdit={handleEditService}
						onDelete={handleDeleteService}
						currentUser={user}
					/>
				</TabsContent>

				<TabsContent value='categories' className='space-y-4'>
					<AttributesManager
						attributes={attributes}
						onSaveAttribute={handleSaveAttribute}
						onDeleteAttribute={handleDeleteAttribute}
					/>

					<CategoryModal
						isOpen={isCategoryModalOpen}
						onClose={() => {
							setIsCategoryModalOpen(false)
							setEditingCategory(null)
						}}
						category={editingCategory}
						attributes={attributes}
						onSave={handleSaveCategory}
						onSaveAttribute={handleSaveAttribute}
					/>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{categories
							.filter(c => c.isActive)
							.map(category => {
								const categoryServices = services.filter(
									s => s.categoryId === category.id && s.isActive
								)
								return (
									<Card
										key={category.id}
										className='cursor-pointer hover:shadow-md transition-shadow'
									>
										<CardHeader className='pb-3'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center space-x-2'>
													<div
														className='w-4 h-4 rounded-full'
														style={{ backgroundColor: category.color }}
													/>
													<CardTitle className='text-lg'>
														{category.name}
													</CardTitle>
												</div>

												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleEditCategory(category)}
												>
													Изменить
												</Button>
											</div>
											{category.description && (
												<CardDescription>
													{category.description}
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<div className='flex items-center justify-between'>
												<Badge variant='secondary'>
													{categoryServices.length} услуг
												</Badge>
												<div className='text-sm text-muted-foreground'>
													от{' '}
													{Math.min(
														...categoryServices.map(s => s.price)
													).toLocaleString()}{' '}
													₽
												</div>
											</div>
										</CardContent>
									</Card>
								)
							})}
					</div>
				</TabsContent>
			</Tabs>

			{/* Modals */}
			<ServiceModal
				isOpen={isServiceModalOpen}
				onClose={() => {
					setIsServiceModalOpen(false)
					setSelectedService(null)
				}}
				service={selectedService}
				categories={categories.filter(c => c.isActive)}
				onSave={handleSaveService}
			/>

			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => {
					setIsCategoryModalOpen(false)
					setSelectedCategory(null)
				}}
				category={selectedCategory}
				onSave={handleSaveCategory}
			/>
		</div>
	)
}
