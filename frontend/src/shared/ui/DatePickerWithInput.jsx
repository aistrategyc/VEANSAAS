import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useForm } from 'react-hook-form'

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

function isValidDate(date) {
	if (!date) {
		return false
	}
	return !isNaN(date.getTime())
}

const DatePickerWithInput = ({ control, name, error }) => {
	const [open, setOpen] = React.useState(false)
	const [date, setDate] = React.useState(new Date())
	const [month, setMonth] = React.useState(date)
	const [value, setValue] = React.useState(formatDate(date))

	const { setValue: setFormValue } = useForm()

	React.useEffect(() => {
		if (date) {
			
			const isoDate = date.toISOString()
			setFormValue(name, isoDate)
		}
	}, [date, name, setFormValue])

	return (
		<div className='flex flex-col gap-3'>
			<Label htmlFor='date' className='px-1'>
				Дата и время *
			</Label>
			<div className='relative flex gap-2'>
				<Input
					id='date'
					value={value}
					placeholder='June 01, 2025'
					className='bg-background pr-10'
					onChange={e => {
						const newDate = new Date(e.target.value)
						setValue(e.target.value)
						if (isValidDate(newDate)) {
							setDate(newDate)
							setMonth(newDate)
						}
					}}
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
							onSelect={selectedDate => {
								setDate(selectedDate)
								setValue(formatDate(selectedDate))
								setOpen(false)
							}}
							className='rounded-md border shadow-sm'
							classNames={{
								cell: 'h-9 w-9 text-base p-0',
								day: 'h-9 w-9 text-base flex items-center justify-center',
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
			{error && <p className='text-sm text-destructive'>{error.message}</p>}
		</div>
	)
}

export default DatePickerWithInput
