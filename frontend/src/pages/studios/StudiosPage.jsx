import { Building2, Users, Clock, DollarSign } from 'lucide-react'
import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { StudiosGrid } from '@/features/studios/StudiosGrid'
import { useEffect, useState } from 'react'
import { StudioModal } from '@/features/studios/StudioModal'
import { useDispatch, useSelector } from 'react-redux'
import { saveStudio, setSearchTerm } from '@/shared/slices/studiosSlice'
import { Loader } from '@/shared/ui/loader/Loader'
import { useUser } from '@/shared/hooks/useUser'

const StudiosPage = () => {
	const dispatch = useDispatch()

	const { isLoading, isLoaded } = useSelector(
		state => state.rootReducer.studios
	)

	const { studios, filteredStudios } = useUser()
	console.log(studios, 'studios')

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingStudio, setEditingStudio] = useState(null)
	console.log(studios, 'studios')
	const statsStudiosList = [
		// {
		// 	id: 1,
		// 	icon: Building2,
		// 	count: studios.length.toString(),
		// 	name: 'Всего студий',
		// },
		// {
		// 	id: 2,
		// 	icon: Users,
		// 	count: studios
		// 		.reduce((sum, studio) => sum + (studio.staff || 0), 0)
		// 		.toString(),
		// 	name: 'Всего сотрудников',
		// },
		// { id: 3, icon: DollarSign, count: '$0', name: 'Выручка сегодня' },
		// { id: 4, icon: Clock, count: '0%', name: 'Средняя загрузка' },
	]

	const onSaveData = async data => {
		await dispatch(saveStudio({ studioData: data, editingStudio })).unwrap()
		setIsCreateModalOpen(false)
		setEditingStudio(null)
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
		dispatch(setSearchTerm(term))
	}

	const handleCloseModal = () => {
		setIsCreateModalOpen(false)
		setEditingStudio(null)
	}

	if (!isLoaded && isLoading) {
		return <Loader />
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

			<StudiosGrid studios={studios} onEditStudio={handleEditStudio} />

			<StudioModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				onSave={onSaveData}
				studio={editingStudio}
			/>
		</div>
	)
}

export default StudiosPage
