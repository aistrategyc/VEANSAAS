import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Scissors, Tag, Folder } from 'lucide-react'
import { ServiceModal } from '@/features/services/ServicesModal'
import { CategoryModal } from '@/features/services/CategoryModal'
import { ServicesTable } from '@/features/services/ServicesTable'

// Импорты Redux
import {
	fetchServices,
	createService,
	updateService,
	deleteService,
	setSearchQuery,
	setCategoryFilter,
	clearFilters,
} from '@/shared/slices/servicesSlice'
import {
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/shared/slices/categoriesSlice'
import { Filters } from '@/features/services/Filters'
import { Loader } from '@/shared/ui/loader/Loader'

export default function ServicesPage() {
	const dispatch = useDispatch()

	// Селекторы для Redux состояния
	const {
		items: services,
		filteredItems: filteredServices,
		searchQuery,
		categoryFilter,
		isLoading: servicesLoading,
	} = useSelector(state => state.rootReducer.services)

	const { items: categories, isLoading: categoriesLoading } = useSelector(
		state => state.rootReducer.categories
	)

	const [selectedService, setSelectedService] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

	useEffect(() => {
		dispatch(fetchServices())
		dispatch(fetchCategories())
	}, [dispatch])

	const handleCreateService = () => {
		setSelectedService(null)
		setIsServiceModalOpen(true)
	}

	const handleEditService = service => {
		setSelectedService(service)
		setIsServiceModalOpen(true)
	}

	const handleSaveService = serviceData => {
		dispatch(createService(serviceData))
		setIsServiceModalOpen(false)
	}

	const handleEditSaveService = (editService, data) => {
		dispatch(
			updateService({
				uuid: editService.uuid,
				serviceData: data,
			})
		)
		setIsServiceModalOpen(false)
		setSelectedService(null)
	}

	const handleDeleteService = async deleteService => {
		await dispatch(deleteService(deleteService.uuid))
		setIsServiceModalOpen(false)
		setSelectedService(null)
	}

	// Обработчики для категорий
	const handleCreateCategory = () => {
		setSelectedCategory(null)
		setIsCategoryModalOpen(true)
	}

	const handleEditCategory = category => {
		setSelectedCategory(category)
		setIsCategoryModalOpen(true)
	}

	const handleSaveCategory = categoryData => {
		dispatch(createCategory(categoryData))
		setIsCategoryModalOpen(false)
	}

	const handleSaveEditCategory = (editCategory, data) => {
		dispatch(
			updateCategory({
				uuid: editCategory.uuid,
				categoryData: data,
			})
		)
		setIsCategoryModalOpen(false)
		setSelectedCategory(null)
	}

	const handleDeleteCategory = editCategory => {
		dispatch(deleteCategory(editCategory.uuid))
		setIsCategoryModalOpen(false)
		setSelectedCategory(null)
	}

	// Обработчики фильтров
	const handleSearchChange = e => {
		dispatch(setSearchQuery(e.target.value))
	}

	const handleCategoryFilterChange = value => {
		dispatch(setCategoryFilter(value))
	}

	const handleClearFilters = () => {
		dispatch(clearFilters())
	}

	// Статистика
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

	if (servicesLoading || categoriesLoading) {
		return <Loader />
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
					<Filters
						searchQuery={searchQuery}
						onSearchChange={handleSearchChange}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={handleCategoryFilterChange}
						categories={activeCategories}
						onClearFilters={handleClearFilters}
					/>

					<ServicesTable
						services={filteredServices}
						categories={categories}
						onEdit={handleEditService}
						onDelete={handleDeleteService}
					/>
				</TabsContent>

				<TabsContent value='categories' className='space-y-4'>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{categories.map(category => {
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
											<CardDescription>{category.description}</CardDescription>
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
													...categoryServices.map(s => s.base_price)
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

			<ServiceModal
				isOpen={isServiceModalOpen}
				onClose={() => {
					setIsServiceModalOpen(false)
					setSelectedService(null)
				}}
				service={selectedService}
				categories={activeCategories}
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
