import { StatsList } from '@/features/stats/StatsList'
import { StudiosGrid } from '@/features/studios/StudiosGrid'
import { useEffect, useState } from 'react'
import { StudioModal } from '@/features/studios/StudioModal'
import { Loader } from '@/shared/ui/loader/Loader'
import useStudios from '@/features/studios/model/api'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const StudiosPage = () => {
	const {
		fetchStudios,
		createStudio,
		updateStudio,
		isLoading,
		studios,
		pagination,
		handlePageChange,
	} = useStudios()

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

	const handleCloseModal = () => {
		setIsCreateModalOpen(false)
		setEditingStudio(null)
	}

	const handlePageChangeWrapper = page => {
		handlePageChange(page, pagination.pageSize)
	}

	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='space-y-6 animate-in fade-in-0 duration-500'>
			<HeaderWrapper title='Студии' desc='Управление филиалами и студиями'>
				<Button onClick={handleStudioIsOpenModal}>
					<Plus className='h-4 w-4 mr-2' />
					Создать студию
				</Button>
			</HeaderWrapper>
			<StatsList />
			<StudiosGrid
				studios={studios}
				onEditStudio={handleEditStudio}
				currentPage={pagination.currentPage}
				pageSize={pagination.pageSize}
				totalCount={pagination.totalCount}
				onPageChange={handlePageChangeWrapper}
			/>
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
