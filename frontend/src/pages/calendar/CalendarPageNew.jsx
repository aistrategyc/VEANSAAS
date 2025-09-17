import {
	mockAppointments,
	mockClients,
	mockServices,
	mockSpaces,
	mockMasters,
} from '@/lib/mock-data'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { CalendarView } from '@/features/calendar/CalendarView'
import { CalendarToolbar } from '@/features/calendar/CalendarToolbar'
import { useState } from 'react'

// Mock users for masters
// const mockMasters = [
// 	{ id: '2', name: 'Мария Мастер', role: 'Master' },
// 	{ id: '3', name: 'Владимир Владелец', role: 'MasterOwner' },
// ]

export default function CalendarPageNew() {
	const user = {
		id: '1',
		email: 'admin@salon.com',
		name: 'Анна Администратор',
		role: 'master',
		organizationId: 'org1',
		isActive: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	}

	const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [selectedSlot, setSelectedSlot] = useState(null)

	// Convert appointments to calendar events
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [viewType, setViewType] = useState('week')
	const [selectedResource, setSelectedResource] = useState('all')
	const [resourceType, setResourceType] = useState('master')

	// Преобразование записей в события календаря
	const events = mockAppointments.map(appointment => {
		const client = mockClients.find(c => c.id === appointment.clientId)
		const service = mockServices.find(s => s.id === appointment.serviceId)
		const master = mockMasters.find(m => m.id === appointment.masterId)
		const space = mockSpaces.find(s => s.id === appointment.spaceId)

		return {
			id: appointment.id,
			title: `${client?.firstName} ${client?.lastName} - ${service?.name}`,
			start: new Date(appointment.startTime),
			end: new Date(appointment.endTime),
			resourceId:
				resourceType === 'master' ? appointment.masterId : appointment.spaceId,
			color: resourceType === 'master' ? master?.color : space?.color,
			data: appointment,
		}
	})

	// Получение ресурсов в зависимости от типа
	const resources =
		resourceType === 'master'
			? mockMasters.map(master => ({
					id: master.id,
					title: master.name,
					type: 'master',
					color: master.color,
			  }))
			: mockSpaces.map(space => ({
					id: space.id,
					title: space.name,
					type: 'space',
					color: space.color,
			  }))
			  console.log(resources)

	const handleEventClick = event => {
		console.log('Событие кликнуто:', event)
		setSelectedAppointment(event.data)
		setIsAppointmentModalOpen(true)
	}

	const handleSlotSelect = slotInfo => {
		console.log('Слот выбран:', slotInfo)
		setSelectedSlot(slotInfo)
		setSelectedAppointment(null)
		setIsAppointmentModalOpen(true)
	}

	const handleAppointmentSave = appointmentData => {
		console.log('[v0] Saving appointment:', appointmentData)
		// Here would be the actual save logic
		setIsAppointmentModalOpen(false)
		setSelectedAppointment(null)
		setSelectedSlot(null)
	}

	const handleAppointmentDelete = appointmentId => {
		console.log('[v0] Deleting appointment:', appointmentId)
		// Here would be the actual delete logic
		setIsAppointmentModalOpen(false)
		setSelectedAppointment(null)
	}
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Календарь записей
					</h1>
					<p className='text-muted-foreground'>
						Управление записями и расписанием
					</p>
				</div>
			</div>

			<CalendarToolbar
				selectedDate={selectedDate}
				onDateChange={setSelectedDate}
				viewType={viewType}
				onViewTypeChange={setViewType}
				resourceType={resourceType}
				onResourceTypeChange={setResourceType}
				selectedResource={selectedResource}
				onResourceChange={setSelectedResource}
				resources={resources}
			/>

			<CalendarView
				events={events}
				resources={resources}
				selectedDate={selectedDate}
				viewType={viewType}
				resourceType={resourceType}
				onEventClick={handleEventClick}
				onSlotSelect={handleSlotSelect}
			/>

			<AppointmentModal
				isOpen={isAppointmentModalOpen}
				onClose={() => {
					setIsAppointmentModalOpen(false)
					setSelectedAppointment(null)
					setSelectedSlot(null)
				}}
				appointment={selectedAppointment}
				selectedSlot={selectedSlot}
				onSave={handleAppointmentSave}
				onDelete={handleAppointmentDelete}
			/>
		</div>
	)
}
