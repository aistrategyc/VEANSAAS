import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useController } from 'react-hook-form'

function formatDateTime(date) {
	if (!date) return 'Выберите дату и время'
	return date.toLocaleString('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function toUTCString(date) {
	if (!date) return null
	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes()
		)
	).toISOString()
}

export const DateTimePicker = ({ name, control, error }) => {
	const {
		field: { value, onChange },
		fieldState,
	} = useController({
		name,
		control,
		rules: { required: 'Дата и время обязательны' },
	})

	const [open, setOpen] = React.useState(false)
	const [showTimeSlots, setShowTimeSlots] = React.useState(false)
	const [date, setDate] = React.useState(value ? new Date(value) : null)
	const [selectedTime, setSelectedTime] = React.useState(null)

	const handleDateSelect = selectedDate => {
		if (!selectedDate) return
		const newDate = new Date(selectedDate)
		newDate.setHours(0)
		newDate.setMinutes(0)
		setDate(newDate)
		setShowTimeSlots(true)
	}

	const handleTimeSelect = time => {
		const [h, m] = time.split(':').map(Number)
		const newDate = new Date(date)
		newDate.setHours(h)
		newDate.setMinutes(m)
		setSelectedTime(time)
		onChange(toUTCString(newDate))
		setDate(newDate)
		setShowTimeSlots(false)
		setOpen(false)
	}

	const generateTimeSlots = () => {
		const times = []
		for (let h = 8; h <= 20; h++) {
			times.push(`${h.toString().padStart(2, '0')}:00`)
			if (h !== 20) times.push(`${h.toString().padStart(2, '0')}:30`)
		}
		return times
	}

	const finalError = error || fieldState?.error

	return (
		<div className='flex flex-col gap-3'>
			<Label htmlFor='datetime' className='px-1'>
				Дата и время *
			</Label>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className='justify-between w-full text-left font-normal'
					>
						{date ? formatDateTime(date) : 'Выберите дату и время'}
						<CalendarIcon className='ml-2 h-4 w-4 opacity-70 shrink-0' />
					</Button>
				</PopoverTrigger>

				<PopoverContent className='w-[320px] p-0'>
					{!showTimeSlots && (
						<Calendar
							mode='single'
							selected={date}
							onSelect={handleDateSelect}
							className='rounded-md border'
							classNames={{
								cell: 'h-8 w-8 p-0 text-base',
								day: 'h-10 w-11 text-base flex items-center justify-center',
							}}
						/>
					)}

					{showTimeSlots && (
						<div className='p-3'>
							<div className='text-sm mb-2 text-muted-foreground'>
								Выберите время:
							</div>
							<div className='grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto'>
								{generateTimeSlots().map(t => (
									<Button
										key={t}
										variant={selectedTime === t ? 'default' : 'outline'}
										size='sm'
										onClick={() => handleTimeSelect(t)}
									>
										{t}
									</Button>
								))}
							</div>
						</div>
					)}
				</PopoverContent>
			</Popover>

			{finalError && (
				<p className='text-sm text-destructive'>{finalError.message}</p>
			)}
		</div>
	)
}
