import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { useEffect, useState } from 'react'
import { useAppointment } from '@/features/appointments/hooks/useAppointment'
import { Loader } from '@/shared/ui/loader/Loader'
import { useClient } from '@/features/clients/hooks/useClients'
import { AppointmentsTable } from '@/features/appointments/AppointmentsTable'

export default function AppointmentsPage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [editingAppointment, setEditingAppointment] = useState(null)

	const {
		fetchAppointments,
		createAppointment,
		isLoading,
		appointments,
		servicesSelectionList,
		getServicesSelectionList,
	} = useAppointment()

	const { clientSelectionList } = useClient()

	useEffect(() => {
		fetchAppointments()
	}, [])

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
				clients={clientSelectionList}
				onEdit={handleEditAppointments}
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
