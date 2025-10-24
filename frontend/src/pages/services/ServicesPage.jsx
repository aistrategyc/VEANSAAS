import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Tag } from 'lucide-react'
import { ServiceModal } from '@/features/services/ServicesModal'
import { CategoryModal } from '@/features/services/CategoryModal'
import { ServicesTable } from '@/features/services/ServicesTable'

import {
	fetchServices,
	createService,
	updateService,
	deleteService,
} from '@/shared/slices/servicesSlice'
import {
	fetchCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/shared/slices/categoriesSlice'
import { Loader } from '@/shared/ui/loader/Loader'
import { ServiceStats } from '@/features/services/ServiceStats'
import { CategoryList } from '@/features/services/CategoryList'
import { Filters } from '@/widgets/filters/Filters'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'

const ServicesPage = () => {
	const dispatch = useDispatch()
	const { items: services, isLoading: servicesLoading } = useSelector(
		state => state.rootReducer.services
	)

	const { items: categories, isLoading: categoriesLoading } = useSelector(
		state => state.rootReducer.categories
	)

	const [selectedService, setSelectedService] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('services')
	const [categoriesLoaded, setCategoriesLoaded] = useState(false)

	useEffect(() => {
		dispatch(fetchServices())
	}, [dispatch])

	useEffect(() => {
		if (activeTab === 'categories') {
			loadCategories()
		}
	}, [activeTab, dispatch])

	const loadCategories = () => {
		if (!categoriesLoaded && (!categories || categories.length === 0)) {
			dispatch(fetchCategories()).then(() => setCategoriesLoaded(true))
		}
	}

	const handleCreateService = () => {
		setSelectedService(null)
		setIsServiceModalOpen(true)
		loadCategories()
	}

	const handleEditService = service => {
		setSelectedService(service)
		setIsServiceModalOpen(true)
		loadCategories()
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

	const handleDeleteService = deleteServiceData => {
		dispatch(deleteService(deleteServiceData.uuid))
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

	if (servicesLoading) {
		return <Loader />
	}

	return (
		<div className='space-y-6'>
			<HeaderWrapper
				title='Услуги'
				desc='Управление услугами и категориями салона'
			>
				<Button variant='outline' onClick={handleCreateCategory}>
					<Tag className='h-4 w-4 mr-2' />
					Добавить категорию
				</Button>
				<Button onClick={handleCreateService}>
					<Plus className='h-4 w-4 mr-2' />
					Добавить услугу
				</Button>
			</HeaderWrapper>

			<ServiceStats services={services} categories={categories} />

			<Tabs
				defaultValue='services'
				className='space-y-4'
				onValueChange={value => setActiveTab(value)}
			>
				<TabsList>
					<TabsTrigger value='services'>Услуги</TabsTrigger>
					<TabsTrigger value='categories'>Категории</TabsTrigger>
				</TabsList>

				<TabsContent value='services' className='space-y-4'>
					<Filters
						title='Поиск услуг'
						description='Найдите нужные услуги по различным критериям'
						searchPlaceholder='Поиск по названию или описанию...'
					/>
					<ServicesTable
						services={services}
						categories={categories}
						onEdit={handleEditService}
						onDelete={handleDeleteService}
					/>
				</TabsContent>
				<TabsContent value='categories' className='space-y-4'>
					{categoriesLoading ? (
						<Loader size='sm' />
					) : (
						<CategoryList categories={categories} onEdit={handleEditCategory} />
					)}
				</TabsContent>
			</Tabs>

			<ServiceModal
				isOpen={isServiceModalOpen}
				onClose={() => {
					setIsServiceModalOpen(false)
					setSelectedService(null)
				}}
				service={selectedService}
				categories={categories}
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

export default ServicesPage
