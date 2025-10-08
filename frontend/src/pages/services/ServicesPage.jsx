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
import { Plus, Search, Scissors, Tag, Folder } from 'lucide-react'
import { ServiceModal } from '@/features/services/ServicesModal'
import { CategoryModal } from '@/features/services/CategoryModal'
import { ServicesTable } from '@/features/services/ServicesTable'
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
	const [services, setServices] = useState([])
	const [categories, setCategories] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [statusFilter, setStatusFilter] = useState('active')

	const [selectedService, setSelectedService] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

	const [editingCategory, setEditingCategory] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			const responseCategory = await api.get('services/categories')
			const responseServices = await api.get('services')

			setCategories(responseCategory.data)
			setServices(responseServices.data)
		}
		fetchData()
	}, [])

	const filteredServices = services.filter(service => {
		const matchesSearch =
			searchQuery === '' ||
			service.name.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesCategory =
			categoryFilter === 'all' || service.category_uuid === categoryFilter

		const matchesStatus =
			statusFilter === 'all' ||
			(statusFilter === 'active' && service.is_active) ||
			(statusFilter === 'inactive' && !service.is_active)

		return matchesSearch && matchesCategory && matchesStatus
	})

	const handleCreateService = () => {
		setSelectedService(null)
		setIsServiceModalOpen(true)
	}

	const handleEditService = service => {
		setSelectedService(service)
		setIsServiceModalOpen(true)
	}

	const handleSaveService = async serviceData => {
		await api.post('/services', serviceData)

		setIsServiceModalOpen(false)
		setSelectedService(null)
	}
	const handleEditSaveService = async (editService, data) => {
		await api.patch(`/services/${editService.uuid}`, data)

		setIsServiceModalOpen(false)
		setSelectedService(null)
	}

	const handleDeleteService = async deleteService => {
		await api.delete(`/services/${deleteService.uuid}`)

		setIsServiceModalOpen(false)
		setSelectedService(null)
	}

	const handleCreateCategory = () => {
		setSelectedCategory(null)
		setIsCategoryModalOpen(true)
	}

	const handleEditCategory = category => {
		setSelectedCategory(category)
		setIsCategoryModalOpen(true)
	}

	const handleSaveCategory = async categoryData => {
		await api.post('/services/categories', categoryData)

		setIsCategoryModalOpen(false)
		setEditingCategory(null)
	}
	const handleSaveEditCategory = async (editCategory, data) => {
		await api.patch(`/services/categories/${editCategory.uuid}`, data)

		setIsCategoryModalOpen(false)
		setEditingCategory(null)
	}
	const handleDeleteCategory = async editCategory => {
		await api.delete(`/services/categories/${editCategory.uuid}`)

		setIsCategoryModalOpen(false)
		setEditingCategory(null)
	}

	const activeServices = services.filter(s => s.is_active)

	const stats = {
		//
		totalServices: activeServices.length,
		totalCategories: categories.filter(c => c.is_active).length,

		averagePrice:
			activeServices.length > 0
				? Math.round(
						activeServices.reduce(
							(sum, s) => sum + parseFloat(s.base_price || 0),
							0
						) / activeServices.length
				  )
				: 0,
		minPrice:
			activeServices.length > 0
				? Math.min(...activeServices.map(s => parseFloat(s.base_price) || 0))
				: 0,
		maxPrice:
			activeServices.length > 0
				? Math.max(...activeServices.map(s => parseFloat(s.base_price) || 0))
				: 0,

		servicesWithDescription: activeServices.filter(
			s => s.description && s.description.trim() !== ''
		).length,
		categorizedServices: activeServices.filter(s => s.category_uuid).length,
	}

	return (
		<div className='space-y-6'>
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
						<div className='text-2xl font-bold'>
							{stats.categorizedServices}
						</div>
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
											.filter(c => c.is_active)
											.map(category => (
												<SelectItem key={category.uuid} value={category.uuid}>
													{category.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					<ServicesTable
						services={filteredServices}
						categories={categories}
						onEdit={handleEditService}
						onDelete={handleDeleteService}
						currentUser={user}
					/>
				</TabsContent>

				<TabsContent value='categories' className='space-y-4'>
					<CategoryModal
						isOpen={isCategoryModalOpen}
						onClose={() => {
							setIsCategoryModalOpen(false)
							setEditingCategory(null)
						}}
						category={editingCategory}
						onSave={handleSaveCategory}
						onEdit={handleSaveEditCategory}
						onDelete={handleDeleteCategory}
					/>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{categories
							.filter(c => c.is_active)
							.map(category => {
								const categoryServices = services.filter(
									s => s.category_uuid === category.uuid && s.is_active
								)
								return (
									<Card
										key={category.uuid}
										className='cursor-pointer hover:shadow-md transition-shadow'
									>
										<CardHeader className='pb-3'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center space-x-2'>
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
													$
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
				categories={categories.filter(c => c.is_active)}
				onSave={handleSaveService}
				onEdit={handleEditSaveService}
				onDelete={handleDeleteService}
			/>

			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => {
					setIsCategoryModalOpen(false)
					setSelectedCategory(null)
				}}
				category={selectedCategory}
				onSave={handleSaveCategory}
				onEdit={handleSaveEditCategory}
				onDelete={handleDeleteCategory}
			/>
		</div>
	)
}
