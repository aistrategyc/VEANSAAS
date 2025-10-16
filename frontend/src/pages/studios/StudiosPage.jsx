import { HeaderPages } from '@/features/headerPages/HeaderPages'
import { StatsList } from '@/features/stats/StatsList'
import { FiltersPages } from '@/features/filtersPages/FiltersPages'
import { StudiosGrid } from '@/features/studios/StudiosGrid'
import { useEffect, useState } from 'react'
import { StudioModal } from '@/features/studios/StudioModal'
import { setSearchTerm } from '@/shared/slices/studiosSlice'
import { Loader } from '@/shared/ui/loader/Loader'
import { useStudios } from '@/features/studios/model/api'

const StudiosPage = () => {
	const { fetchStudios, createStudio, updateStudio, isLoading, studios } =
		useStudios()

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingStudio, setEditingStudio] = useState(null)

	useEffect(() => {
		fetchStudios()
	}, [])

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

	if (isLoading) {
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
			<StatsList />
			<FiltersPages
				placeholder='Поиск по названию...'
				type='studio'
				onSearch={handleSearch}
			/>

			<StudiosGrid studios={studios} onEditStudio={handleEditStudio} />

			<StudioModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				handleCreate={createStudio}
				handleUpdate={updateStudio}
				studio={editingStudio}
			/>
		</div>
	)
}

export default StudiosPage
