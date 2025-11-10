import { Card, CardContent } from '@/components/ui/card'
import { eachDayOfInterval, format, isSameDay, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { EventBlock } from './EventBlock'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover'

export function MasterTimelineView({
	viewType,
	selectedDate,
	dateRange,
	events,
	resources,
	onEventClick,
	onSlotSelect,
}) {
	const now = new Date()
	const today = startOfDay(now)

	// Временные слоты для дневного вида
	const timeSlots = []
	for (let hour = 9; hour < 20; hour++) {
		timeSlots.push({ hour, minute: 0, label: `${hour}:00` })
		timeSlots.push({ hour, minute: 30, label: `${hour}:30` })
	}

	const getEventsForMaster = (masterId, day) =>
		events
			.filter(e => e.resourceId === masterId && isSameDay(e.start, day))
			.sort((a, b) => a.start - b.start)

	// ====== Дни для рендера ======
	let days = []
	if (viewType === 'day') {
		days = [selectedDate] // один день
	} else if (viewType === 'week' && dateRange?.from && dateRange?.to) {
		days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
	}

	return (
		<div className='overflow-x-auto'>
			<Card>
				{/* Заголовок */}
				<div
					className={`grid ${
						viewType === 'day'
							? 'grid-cols-[200px_repeat(22,1fr)]'
							: `grid-cols-[200px_repeat(${days.length},1fr)]`
					} border-b bg-muted/40`}
				>
					<div className='p-3 border-r font-semibold bg-muted/60'>Мастер</div>

					{viewType === 'day'
						? timeSlots.map((slot, index) => (
								<div
									key={index}
									className='text-center border-r py-2 text-xs font-medium'
								>
									{slot.label}
								</div>
						  ))
						: days.map((day, index) => (
								<div
									key={index}
									className='text-center border-r py-2 text-xs font-semibold'
								>
									{format(day, 'EEE, d MMM', { locale: ru })}
								</div>
						  ))}
				</div>

				<CardContent className='p-0 divide-y'>
					{resources.map(master => {
						if (viewType === 'day') {
							const masterEvents = getEventsForMaster(master.id, selectedDate)
							return (
								<div
									key={master.id}
									className='relative grid grid-cols-[200px_repeat(22,1fr)] border-b last:border-none'
								>
									{/* Имя мастера */}
									<div className='p-3 border-r bg-muted/20 font-medium flex items-center'>
										<div
											className='w-3 h-3 rounded-full mr-2'
											style={{ backgroundColor: master.color }}
										/>
										{master.title}
									</div>

									{/* Ячейки времени */}
									{timeSlots.map((slot, index) => (
										<div
											key={index}
											className='relative border-r min-h-[60px] hover:bg-muted/10 cursor-pointer'
											onClick={() =>
												onSlotSelect({
													start: new Date(
														selectedDate.getFullYear(),
														selectedDate.getMonth(),
														selectedDate.getDate(),
														slot.hour,
														slot.minute
													),
													end: new Date(
														selectedDate.getFullYear(),
														selectedDate.getMonth(),
														selectedDate.getDate(),
														slot.hour,
														slot.minute + 30
													),
													resourceId: master.id,
												})
											}
										></div>
									))}

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
						} else {
							// Неделя / диапазон
							return (
								<div
									key={master.id}
									className='grid border-b last:border-none'
									style={{
										gridTemplateColumns: `200px repeat(${days.length}, 1fr)`,
									}}
								>
									{/* Имя мастера */}
									<div className='p-3 border-r bg-muted/20 font-medium flex items-center'>
										<div
											className='w-3 h-3 rounded-full mr-2'
											style={{ backgroundColor: master.color }}
										/>
										{master.title}
									</div>

									{/* Дни */}
									{days.map((day, index) => {
										const masterEvents = getEventsForMaster(master.id, day)
										const count = masterEvents.length
										return (
											<Popover key={index}>
												<PopoverTrigger asChild>
													<div className='border-r min-h-[100px] flex flex-col items-center justify-center hover:bg-muted/10 cursor-pointer'>
														{count === 0
															? 'Нет записей'
															: `${count} ${count === 1 ? 'запись' : 'записи'}`}
													</div>
												</PopoverTrigger>
												{count > 0 && (
													<PopoverContent
														align='center'
														side='bottom'
														className='w-64 p-2'
													>
														{masterEvents.map(ev => (
															<div
																key={ev.id}
																className='py-1 px-1 hover:bg-muted/50 cursor-pointer rounded'
																onClick={() => onEventClick(ev)}
															>
																<div className='text-sm font-medium'>
																	{ev.serviceName}
																</div>
																<div className='text-xs text-muted-foreground'>
																	{format(ev.start, 'HH:mm')} • {ev.price} ₽
																</div>
															</div>
														))}
													</PopoverContent>
												)}
											</Popover>
										)
									})}
								</div>
							)
						}
					})}
				</CardContent>
			</Card>
		</div>
	)
}
