import * as React from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useController } from 'react-hook-form'

function formatDate(date) {
	if (!date) {
		return ''
	}

	return date.toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	})
}

function formatTime(date) {
	if (!date) {
		return ''
	}

	return date.toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
}

function isValidDate(date) {
	if (!date) {
		return false
	}
	return !isNaN(date.getTime())
}

function toUTCString(date) {
	if (!date) return null

	return new Date(
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds()
		)
	).toISOString()
}

export function DateTimePicker({ name, control, error }) {
	const {
		field: { value, onChange },
		fieldState,
	} = useController({
		name,
		control,
		rules: { required: 'Дата и время обязательны' },
	})

	const [open, setOpen] = React.useState(false)
	const [date, setDate] = React.useState(value ? new Date(value) : new Date())
	const [month, setMonth] = React.useState(value ? new Date(value) : new Date())
	const [dateValue, setDateValue] = React.useState(formatDate(date))
	const [timeValue, setTimeValue] = React.useState(formatTime(date))

	React.useEffect(() => {
		if (value) {
			const newDate = new Date(value)
			setDate(newDate)
			setDateValue(formatDate(newDate))
			setTimeValue(formatTime(newDate))
		}
	}, [value])

	const handleDateSelect = selectedDate => {
		if (selectedDate) {
			const newDate = new Date(selectedDate)
			newDate.setHours(date.getHours())
			newDate.setMinutes(date.getMinutes())
			newDate.setSeconds(date.getSeconds())

			setDate(newDate)
			setDateValue(formatDate(newDate))
			setTimeValue(formatTime(newDate))

			onChange(toUTCString(newDate))
			setOpen(false)
		}
	}

	const handleTimeChange = e => {
		const timeString = e.target.value
		if (timeString) {
			const [hours, minutes, seconds] = timeString.split(':').map(Number)
			const newDate = new Date(date)
			newDate.setHours(hours || 0)
			newDate.setMinutes(minutes || 0)
			newDate.setSeconds(seconds || 0)

			setDate(newDate)
			setTimeValue(formatTime(newDate))

			onChange(toUTCString(newDate))
		}
	}

	const handleDateInputChange = e => {
		const newDate = new Date(e.target.value)
		setDateValue(e.target.value)

		if (isValidDate(newDate)) {
			newDate.setHours(date.getHours())
			newDate.setMinutes(date.getMinutes())
			newDate.setSeconds(date.getSeconds())

			setDate(newDate)
			setMonth(newDate)

			onChange(toUTCString(newDate))
		}
	}

	const finalError = error || fieldState?.error

	return (
		<div className='flex flex-col gap-3'>
			<Label htmlFor='datetime' className='px-1'>
				Дата и время *
			</Label>
			<div className='flex gap-2'>
				<div className='relative flex-1'>
					<Input
						id='date'
						value={dateValue}
						placeholder='June 01, 2025'
						className='bg-background pr-10'
						onChange={handleDateInputChange}
						onKeyDown={e => {
							if (e.key === 'ArrowDown') {
								e.preventDefault()
								setOpen(true)
							}
						}}
					/>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								id='date-picker'
								variant='ghost'
								className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
							>
								<CalendarIcon className='size-3.5' />
								<span className='sr-only'>Select date</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-full overflow-hidden p-0' align='end'>
							<Calendar
								mode='single'
								selected={date}
								captionLayout='dropdown'
								month={month}
								onMonthChange={setMonth}
								onSelect={handleDateSelect}
								className='rounded-md border shadow-sm'
								classNames={{
									cell: 'h-9 w-9 text-base p-0',
									day: 'h-9 w-9 text-base flex items-center justify-center',
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className='relative flex-1'>
					<Input
						type='time'
						step='1'
						value={timeValue}
						onChange={handleTimeChange}
						className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none pr-10'
					/>
					<div className='absolute top-1/2 right-3 -translate-y-1/2'>
						<Clock className='size-4 text-muted-foreground' />
					</div>
				</div>
			</div>
			{finalError && (
				<p className='text-sm text-destructive'>{finalError.message}</p>
			)}
		</div>
	)
}
