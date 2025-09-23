import { Building2, Users, Clock, DollarSign } from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { StudiosGrid } from '@/features/studios/StudiosGrid'
import { useState, useEffect } from 'react'
import { StudioModal } from '@/features/studios/StudioModal'
import { api } from '@/shared/api/api'

export default function StudiosPage() {
	const [studios, setStudios] = useState([])
	const [filteredStudios, setFilteredStudios] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingStudio, setEditingStudio] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const fetchStudios = async () => {
		try {
			setIsLoading(true)
			const response = await api.get('/studios')
			const studiosData = response.data.items.map((studio, index) => ({
				...studio,
				id: index + 1,
				manager: 'Менеджер не указан',
				staff: studio.members_count || 0,
				rooms: 0,
				todayRevenue: '$0',
				monthRevenue: '$0',
				occupancy: 0,
				status: 'active',
				services: ['Услуги не указаны'],
				address: studio.address || 'Адрес не указан',
				phone: studio.phone_number || 'Телефон не указан',
			}))
			setStudios(studiosData)
			setFilteredStudios(studiosData)
		} catch (error) {
			console.error('Ошибка при загрузке студий:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchStudios()
	}, [])
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredStudios(studios)
		} else {
			const filtered = studios.filter(studio =>
				studio.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredStudios(filtered)
		}
	}, [searchTerm, studios])

	const statsStudiosList = [
		{
			id: 1,
			icon: Building2,
			count: studios.length.toString(),
			name: 'Всего студий',
		},
		{
			id: 2,
			icon: Users,
			count: studios
				.reduce((sum, studio) => sum + (studio.staff || 0), 0)
				.toString(),
			name: 'Всего сотрудников',
		},
		{ id: 3, icon: DollarSign, count: '$0', name: 'Выручка сегодня' },
		{ id: 4, icon: Clock, count: '0%', name: 'Средняя загрузка' },
	]

	const onSaveData = async data => {
		if (editingStudio) {
			await api.patch(`/studios/${editingStudio.uuid}`, { name: data.name })
			console.log('Студия успешно обновлена', data)
			setEditingStudio(null)
		} else {
			await api.post('/studios', data)
			console.log('Студия успешно создана', data)
		}
		await fetchStudios()
		setIsCreateModalOpen(false)
	}

	const handleStudioIsOpenModal = () => {
		setEditingStudio(null)
		setIsCreateModalOpen(true)
	}

	const handleEditStudio = studio => {
		setEditingStudio(studio)
		setIsCreateModalOpen(true)
	}

	const handleSearch = term => {
		setSearchTerm(term)
	}

	const handleCloseModal = () => {
		setIsCreateModalOpen(false)
		setEditingStudio(null)
	}

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			<HeaderPages
				description='Управление филиалами и студиями'
				nameButton='Добавить студию'
				title='Студии'
				onClick={handleStudioIsOpenModal}
			/>
			<StatsList stats={statsStudiosList} />
			<FiltersPages
				placeholder='Поиск по названию...'
				type='studio'
				onSearch={handleSearch}
			/>

			{isLoading ? (
				<div className='flex justify-center items-center py-8'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
				</div>
			) : (
				<StudiosGrid
					studios={filteredStudios}
					onEditStudio={handleEditStudio}
				/>
			)}

			<StudioModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				onSave={onSaveData}
				studio={editingStudio}
			/>
		</div>
	)
}
