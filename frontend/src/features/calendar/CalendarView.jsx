import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	format,
	startOfWeek,
	addDays,
	isSameDay,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
} from 'date-fns'
import { ru } from 'date-fns/locale'

export function CalendarView({
	events,
	resources,
	selectedDate,
	viewType,
	resourceType,
	onEventClick,
	onSlotSelect,
}) {
	const [draggedEvent, setDraggedEvent] = useState(null)

	const handleSlotClick = (date, hour, resourceId = null) => {
		const start = new Date(date)
		start.setHours(hour, 0, 0, 0)
		const end = new Date(start)
		end.setHours(hour + 1, 0, 0, 0)

		onSlotSelect({ start, end, resourceId })
	}

	const renderDayView = () => {
		const hours = Array.from({ length: 12 }, (_, i) => i + 9) // 9:00 - 20:00

		return (
			<div className='overflow-x-auto'>
				<div className='grid grid-cols-1 gap-4 min-w-max'>
					{resources.map(resource => (
						<Card key={resource.id} className='overflow-hidden min-w-[800px]'>
							<div className='p-4 border-b bg-muted/50'>
								<h3 className='font-semibold'>{resource.title}</h3>
								<Badge variant='outline' style={{ color: resource.color }}>
									{resourceType === 'master' ? 'Мастер' : 'Место'}
								</Badge>
							</div>
							<CardContent className='p-0'>
								<div className='grid grid-cols-12 gap-px bg-border'>
									{hours.map(hour => {
										const slotEvents = events.filter(
											event =>
												event.resourceId === resource.id &&
												isSameDay(event.start, selectedDate) &&
												event.start.getHours() === hour
										)

										return (
											<div
												key={hour}
												className='bg-background p-2 min-h-[60px] cursor-pointer hover:bg-muted/50 transition-colors'
												onClick={() =>
													handleSlotClick(selectedDate, hour, resource.id)
												}
											>
												<div className='text-xs text-muted-foreground mb-1'>
													{hour}:00
												</div>
												{slotEvents.map(event => (
													<div
														key={event.id}
														className='text-xs p-2 rounded cursor-pointer hover:opacity-80 mb-1'
														style={{
															backgroundColor: event.color + '20',
															borderLeft: `3px solid ${event.color}`,
														}}
														onClick={e => {
															e.stopPropagation()
															onEventClick(event)
														}}
													>
														<div className='font-medium'>{event.time}</div>
														<div className='font-semibold'>{event.title}</div>
														<div className='text-muted-foreground'>
															{event.price}
														</div>
														<div className='text-xs opacity-70'>
															{event.masterName}
														</div>
													</div>
												))}
											</div>
										)
									})}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	const renderWeekView = () => {
		const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
		const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
		const hours = Array.from({ length: 12 }, (_, i) => i + 9)

		return (
			<div className='overflow-x-auto'>
				<Card className='overflow-hidden min-w-[1000px]'>
					<div className='grid grid-cols-8 border-b'>
						<div className='p-4 border-r bg-muted/50'>
							<div className='text-sm font-medium'>Время</div>
						</div>
						{weekDays.map(day => (
							<div
								key={day.toISOString()}
								className='p-4 border-r bg-muted/50 text-center'
							>
								<div className='text-sm font-medium'>
									{format(day, 'EEE', { locale: ru })}
								</div>
								<div className='text-lg font-bold'>{format(day, 'd')}</div>
							</div>
						))}
					</div>
					<div className='max-h-[600px] overflow-y-auto'>
						{hours.map(hour => (
							<div
								key={hour}
								className='grid grid-cols-8 border-b min-h-[60px]'
							>
								<div className='p-2 border-r bg-muted/30 text-center'>
									<div className='text-sm text-muted-foreground'>{hour}:00</div>
								</div>
								{weekDays.map(day => {
									const dayEvents = events.filter(
										event =>
											isSameDay(event.start, day) &&
											event.start.getHours() === hour
									)

									return (
										<div
											key={`${day.toISOString()}-${hour}`}
											className='p-1 border-r cursor-pointer hover:bg-muted/50 transition-colors'
											onClick={() => handleSlotClick(day, hour)}
										>
											{dayEvents.map(event => (
												<div
													key={event.id}
													className='text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80'
													style={{
														backgroundColor: event.color + '20',
														borderLeft: `3px solid ${event.color}`,
													}}
													onClick={e => {
														e.stopPropagation()
														onEventClick(event)
													}}
												>
													<div className='font-medium'>{event.time}</div>
													<div className='font-semibold truncate'>
														{event.title}
													</div>
													<div className='text-muted-foreground'>
														{event.price}
													</div>
													<div className='text-xs opacity-70'>
														{event.masterName}
													</div>
												</div>
											))}
										</div>
									)
								})}
							</div>
						))}
					</div>
				</Card>
			</div>
		)
	}

	const renderMonthView = () => {
		const monthStart = startOfMonth(selectedDate)
		const monthEnd = endOfMonth(selectedDate)
		const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
		const calendarEnd = addDays(calendarStart, 41) // 6 weeks
		const calendarDays = eachDayOfInterval({
			start: calendarStart,
			end: calendarEnd,
		})

		return (
			<div className='overflow-x-auto'>
				<Card className='overflow-hidden min-w-[900px]'>
					<div className='grid grid-cols-7 border-b'>
						{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
							<div
								key={day}
								className='p-4 text-center font-medium bg-muted/50 border-r'
							>
								{day}
							</div>
						))}
					</div>
					<div className='grid grid-cols-7'>
						{calendarDays.map(day => {
							const dayEvents = events.filter(event =>
								isSameDay(event.start, day)
							)
							const isCurrentMonth = isSameMonth(day, selectedDate)
							const isToday = isSameDay(day, new Date())

							return (
								<div
									key={day.toISOString()}
									className={`min-h-[120px] p-2 border-r border-b cursor-pointer hover:bg-muted/50 transition-colors ${
										!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
									} ${isToday ? 'bg-primary/10' : ''}`}
									onClick={() => handleSlotClick(day, 9)}
								>
									<div
										className={`text-sm font-medium mb-1 ${
											isToday ? 'text-primary' : ''
										}`}
									>
										{format(day, 'd')}
									</div>
									<div className='space-y-1'>
										{dayEvents.slice(0, 3).map(event => (
											<div
												key={event.id}
												className='text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate'
												style={{
													backgroundColor: event.color + '20',
													borderLeft: `2px solid ${event.color}`,
												}}
												onClick={e => {
													e.stopPropagation()
													onEventClick(event)
												}}
											>
												{event.title}
											</div>
										))}
										{dayEvents.slice(0, 3).map(event => (
											<div
												key={event.id}
												className='text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate'
												style={{
													backgroundColor: event.color + '20',
													borderLeft: `2px solid ${event.color}`,
												}}
												onClick={e => {
													e.stopPropagation()
													onEventClick(event)
												}}
											>
												<div className='font-semibold truncate'>
													{event.time} {event.title}
												</div>
												<div className='text-muted-foreground truncate'>
													{event.price}
												</div>
											</div>
										))}
									</div>
								</div>
							)
						})}
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			{viewType === 'day' && renderDayView()}
			{viewType === 'week' && renderWeekView()}
			{viewType === 'month' && renderMonthView()}
		</div>
	)
}
