import { Card, CardContent } from '@/components/ui/card'
import { format, isSameDay, isBefore, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { EventBlock } from './EventBlock'

export function MasterTimelineView({
	selectedDate,
	events,
	resources,
	onEventClick,
	onSlotSelect,
}) {
	// Создаем массив временных слотов по 30 минут с 9:00 до 20:00
	const timeSlots = []
	for (let hour = 9; hour < 20; hour++) {
		timeSlots.push(
			{ hour, minute: 0, label: `${hour}:00` },
			{ hour, minute: 30, label: `${hour}:30` }
		)
	}

	// Получаем текущее время
	const now = new Date()
	const today = startOfDay(now)
	const isSelectedDateToday = isSameDay(selectedDate, today)
	const currentHour = now.getHours()
	const currentMinute = now.getMinutes()

	const handleSlotClick = (masterId, hour, minute) => {
		// Проверяем, не прошедшее ли время
		if (isSelectedDateToday) {
			if (
				hour < currentHour ||
				(hour === currentHour && minute <= currentMinute)
			) {
				return // Не обрабатываем клик по прошедшему времени
			}
		}

		const start = new Date(selectedDate)
		start.setHours(hour, minute, 0, 0)
		const end = new Date(start)
		end.setMinutes(minute + 30, 0, 0)
		onSlotSelect({ start, end, resourceId: masterId })
	}

	// Функция для проверки, является ли ячейка неактивной
	const isSlotDisabled = (hour, minute) => {
		if (!isSelectedDateToday) return false
		return (
			hour < currentHour || (hour === currentHour && minute <= currentMinute)
		)
	}

	const getEventsForMaster = id =>
		events
			.filter(e => e.resourceId === id && isSameDay(e.start, selectedDate))
			.sort((a, b) => a.start - b.start)

	return (
		<div className='overflow-x-auto'>
			<Card>
				{/* Заголовок */}
				<div className='grid grid-cols-[200px_repeat(22,1fr)] border-b bg-muted/40'>
					<div className='p-3 border-r font-semibold bg-muted/60'>Мастер</div>
					{timeSlots.map((slot, index) => (
						<div
							key={index}
							className={`text-center border-r py-2 text-xs font-medium ${
								slot.minute === 30 ? 'text-muted-foreground' : ''
							}`}
						>
							{slot.minute === 0 ? (
								<div>{slot.hour}:00</div>
							) : (
								<div>{slot.hour}:30</div>
							)}
						</div>
					))}
				</div>
				<CardContent className='p-0 divide-y'>
					{resources.map(master => {
						const masterEvents = getEventsForMaster(master.id)
						return (
							<div
								key={master.id}
								className='relative grid grid-cols-[200px_repeat(22,1fr)] border-b last:border-none'
							>
								<div className='p-3 border-r bg-muted/20 font-medium flex items-center'>
									<div
										className='w-3 h-3 rounded-full mr-2'
										style={{ backgroundColor: master.color }}
									/>
									{master.title}
								</div>

								{/* Ячейки времени */}
								{timeSlots.map((slot, index) => {
									const isDisabled = isSlotDisabled(slot.hour, slot.minute)
									return (
										<div
											key={index}
											className={`relative border-r min-h-[60px] z-10 ${
												slot.minute === 30 ? 'border-dashed' : 'border-solid'
											} ${
												isDisabled
													? 'bg-muted-foreground/40 cursor-not-allowed opacity-50'
													: 'hover:bg-muted/10 cursor-pointer'
											}`}
											onClick={() =>
												!isDisabled &&
												handleSlotClick(master.id, slot.hour, slot.minute)
											}
										></div>
									)
								})}

								{/* События */}
								<div
									className='absolute left-[200px] top-0 h-full w-[calc(100%-200px)] grid pointer-events-none'
									style={{ gridTemplateColumns: 'repeat(22, 1fr)' }}
								>
									{masterEvents.map(event => (
										<EventBlock
											key={event.id}
											event={event}
											onClick={onEventClick}
											timeSlots={timeSlots}
										/>
									))}
								</div>
							</div>
						)
					})}
				</CardContent>
			</Card>
		</div>
	)
}
