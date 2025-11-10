import { useState, useEffect, useMemo } from 'react'
import { useAppointment } from '@/features/appointments/hooks/useAppointment'
import { AppointmentModal } from '@/features/appointments/AppointmentModal'
import { CalendarToolbar } from '@/features/calendar/CalendarToolbar'
import { MasterTimelineView } from '@/features/calendar/MasterTimelineView'
import useStudios from '@/features/studios/model/api'
import { Loader } from '@/shared/ui/loader/Loader'

const generateMasterColors = masters => {
	const palette = [
		'#3B82F6',
		'#EF4444',
		'#10B981',
		'#F59E0B',
		'#8B5CF6',
		'#EC4899',
		'#06B6D4',
		'#84CC16',
		'#F97316',
		'#6366F1',
	]
	const colorMap = {}
	masters.forEach((m, i) => (colorMap[m.uuid] = palette[i % palette.length]))
	return colorMap
}

const CalendarPage = () => {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [selectedSlot, setSelectedSlot] = useState(null)
	const [viewType, setViewType] = useState('day')
	const [selectedResource, setSelectedResource] = useState('all')

	const {
		appointments,
		isLoading,
		servicesSelectionList,
		masterSelectionList,
		fetchAppointments,
		getServicesSelectionList,
		getMasterSelectionList,
		createAppointment,
	} = useAppointment()
	const { currentStudio } = useStudios()

	useEffect(() => {
		fetchAppointments({ pageSize: 1000 })
		getServicesSelectionList()
		getMasterSelectionList()
	}, [currentStudio])

	const masterColors = useMemo(
		() => generateMasterColors(masterSelectionList),
		[masterSelectionList]
	)

	const resources = useMemo(
		() =>
			masterSelectionList.map(m => ({
				id: m.uuid,
				title: `${m.first_name} ${m.last_name}`,
				color: masterColors[m.uuid],
			})),
		[masterSelectionList, masterColors]
	)

	const events = useMemo(() => {
		return appointments.map(a => {
			const start = new Date(a.date_time)
			const end = new Date(start.getTime() + a.duration * 60000)
			return {
				id: a.uuid,
				start,
				end,
				duration: a.duration,
				resourceId: a.master_uuid,
				serviceName: a.service?.name || 'услуга',
				price: a.price,
				color: masterColors[a.master_uuid] || '#888',
				data: a,
			}
		})
	}, [appointments, masterColors])

	const filteredResources =
		selectedResource === 'all'
			? resources
			: resources.filter(r => r.id === selectedResource)

	const filteredEvents =
		selectedResource === 'all'
			? events
			: events.filter(e => e.resourceId === selectedResource)

	const handleEventClick = e => {
		setSelectedAppointment(e.data)
		setIsModalOpen(true)
	}

	const handleSlotSelect = slot => {
		setSelectedSlot(slot)
		setSelectedAppointment(null)
		setIsModalOpen(true)
	}

	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-3xl font-bold tracking-tight'>Календарь записей</h1>

			<CalendarToolbar
				selectedDate={selectedDate}
				onDateChange={setSelectedDate}
				viewType={viewType}
				onViewTypeChange={setViewType}
				selectedResource={selectedResource}
				onResourceChange={setSelectedResource}
				resources={resources}
			/>

			<MasterTimelineView
				selectedDate={selectedDate}
				events={filteredEvents}
				resources={filteredResources}
				onEventClick={handleEventClick}
				onSlotSelect={handleSlotSelect}
			/>

			<AppointmentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				appointment={selectedAppointment}
				selectedSlot={selectedSlot}
				handleCreate={createAppointment}
				services={servicesSelectionList}
				masters={masterSelectionList}
			/>
		</div>
	)
}
export default CalendarPage
