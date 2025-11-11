import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function EventBlock({ event, onClick, timeSlots }) {
	const start = event.start
	const end = event.end

	// Находим индекс начального слота
	const startSlotIndex = timeSlots.findIndex(
		slot => slot.hour === start.getHours() && slot.minute === start.getMinutes()
	)

	// Рассчитываем количество 30-минутных интервалов
	const durationInMinutes = (end - start) / (1000 * 60)
	const numberOfSlots = Math.ceil(durationInMinutes / 30)

	// Если не нашли начальный слот или расчет некорректен
	if (startSlotIndex === -1 || numberOfSlots <= 0) return null

	// Проверяем, чтобы не выходило за границы
	const span = Math.min(numberOfSlots, timeSlots.length - startSlotIndex)

	return (
		<div
			className='relative m-[1px] rounded p-2 text-xs shadow-sm cursor-pointer overflow-hidden border pointer-events-auto z-20'
			style={{
				gridColumn: `${startSlotIndex + 1} / span ${span}`,
				borderColor: event.color,
				background: `linear-gradient(90deg, ${event.color}40 0%, ${event.color}20 60%, transparent 100%)`,
			}}
			onClick={e => {
				e.stopPropagation()
				onClick(event)
			}}
		>
			<div className='font-semibold truncate'>{event.serviceName}</div>
			<div className='text-muted-foreground'>
				{format(event.start, 'HH:mm', { locale: ru })} —{' '}
				{format(event.end, 'HH:mm', { locale: ru })}
			</div>
			<div className='opacity-70'>{event.price} $</div>
		</div>
	)
}
