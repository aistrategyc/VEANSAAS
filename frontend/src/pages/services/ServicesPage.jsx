import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Tag } from 'lucide-react'
import ServiceModal from '@/features/services/ServicesModal'
import { CategoryModal } from '@/features/services/CategoryModal'
import ServicesTable from '@/features/services/ServicesTable'
import {
	createService,
	updateService,
	deleteService,
} from '@/shared/slices/servicesSlice'
import {
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/shared/slices/categoriesSlice'
import { Loader } from '@/shared/ui/loader/Loader'

import { useService } from '@/shared/hooks/useService'
import { CategoryList } from '@/features/services/CategoryList'
import { Filters } from '@/widgets/filters/Filters'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'

const ServicesPage = () => {
	const dispatch = useDispatch()
	const { services, categories } = useService()

	const [activeTab, setActiveTab] = useState('services')
	const [selectedService, setSelectedService] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

	useEffect(() => {
		if (activeTab === 'services' && services.data.items.length === 0) {
			services.fetch()
		}

		if (activeTab === 'categories' && categories.data.items.length === 0) {
			categories.fetch()
		}
	}, [activeTab])

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

	if (services.isLoading || categories.isLoading) {
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

			{/* <ServiceStats services={services.data} categories={categories} /> */}

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-4'
			>
				<TabsList>
					<TabsTrigger value='services'>Услуги</TabsTrigger>
					<TabsTrigger value='categories'>Категории</TabsTrigger>
				</TabsList>
				<TabsContent value='services' className='space-y-4'>
					{activeTab === 'services' && (
						<ServicesTable
							services={services.data}
							onEdit={handleEditService}
							onDelete={handleDeleteService}
						/>
					)}
				</TabsContent>
				<TabsContent value='categories' className='space-y-4'>
					{activeTab === 'categories' && (
						<CategoryList
							categories={categories.data}
							onEdit={handleEditCategory}
						/>
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
