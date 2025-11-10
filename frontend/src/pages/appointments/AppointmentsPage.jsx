import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { useEffect, useState } from 'react'
import { useAppointment } from '@/features/appointments/hooks/useAppointment'
import { Loader } from '@/shared/ui/loader/Loader'

import { AppointmentsTable } from '@/features/appointments/AppointmentsTable'
import useStudios from '@/features/studios/model/api'

const AppointmentsPage = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingAppointment, setEditingAppointment] = useState(null)

	const {
		fetchAppointments,
		createAppointment,
		isLoading,
		appointments,
		pagination,
		handlePageChange,
	} = useAppointment()
	const { currentStudio } = useStudios()

	useEffect(() => {
		fetchAppointments()
	}, [currentStudio])

	const handleStudioIsOpenModal = () => {
		setEditingAppointment(null)
		setIsCreateModalOpen(true)
	}

	const handleEditAppointments = appointment => {
		setEditingAppointment(appointment)
		setIsCreateModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsCreateModalOpen(false)
		setEditingAppointment(null)
	}
	const handlePageChangeWrapper = page => {
		handlePageChange(page, pagination.pageSize)
	}

	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='space-y-6'>
			<HeaderWrapper title='Записи' desc='Управление записями клиентов'>
				<Button onClick={handleStudioIsOpenModal}>
					<Plus className='h-4 w-4 mr-2' />
					Новая запись
				</Button>
			</HeaderWrapper>

			<AppointmentsTable
				appointments={appointments}
				onEdit={handleEditAppointments}
				currentPage={pagination.currentPage}
				pageSize={pagination.pageSize}
				totalCount={pagination.totalCount}
				onPageChange={handlePageChangeWrapper}
			/>

			<AppointmentModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				handleCreate={createAppointment}
				appointment={editingAppointment}
			/>
		</div>
	)
}
export default AppointmentsPage
