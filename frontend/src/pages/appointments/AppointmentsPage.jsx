import { AppointmentsList } from '@/features/appointments/AppointmentsList'
import { HeaderWrapper } from '@/widgets/wrapper/HeaderWrapper'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { useEffect, useState } from 'react'
import { useAppointment } from '@/features/appointments/hooks/useAppointment'
import { Loader } from '@/shared/ui/loader/Loader'
import { useDispatch } from 'react-redux'
import { useClient } from '@/features/clients/hooks/useClients'

export default function AppointmentsPage() {
	const appointments1 = [
		{
			id: 1,
			time: '09:00',
			date: '2024-01-15',
			client: 'Анна Петрова',
			phone: '+33 1 23 45 67 89',
			service: 'Стрижка + окрашивание',
			master: 'Елена Кузнецова',
			duration: '2ч 30мин',
			price: '€85',
			status: 'confirmed',
			prepaid: '€25',
			notes: 'Клиент просит сохранить длину',
		},
	]

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
	const { clientSelectionList, getClientSelectionList } = useClient()

	const dispatch = useDispatch()

	useEffect(() => {
		fetchAppointments()
		getClientSelectionList()
		getServicesSelectionList()
	}, [])

	const handleStudioIsOpenModal = () => {
		setEditingAppointment(null)
		setIsCreateModalOpen(true)
	}

	const handleEditStudio = appointment => {
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

			<AppointmentsList appointments={appointments1} />
			<AppointmentModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseModal}
				services={servicesSelectionList}
				customers={clientSelectionList}
				handleCreate={createAppointment}
				appointment={editingAppointment}
			/>
		</div>
	)
}
