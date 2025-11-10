import { Button } from '@/components/ui/button'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'

export function CalendarToolbar({
	selectedDate,
	onDateChange,
	viewType,
	onViewTypeChange,
	selectedResource,
	onResourceChange,
	resources,
}) {
	return (
		<div className='flex flex-wrap justify-between items-center gap-4 p-4 bg-card rounded-lg border'>
			{/* Левая часть: навигация по дате */}
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onDateChange(subDays(selectedDate, 1))}
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant='outline' className='min-w-[200px] justify-start'>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{format(selectedDate, 'd MMMM yyyy', { locale: ru })}
						</Button>
					</PopoverTrigger>
					<PopoverContent align='start' className='p-0'>
						<Calendar
							mode='single'
							selected={selectedDate}
							onSelect={date => date && onDateChange(date)}
						/>
					</PopoverContent>
				</Popover>

				<Button
					variant='outline'
					size='sm'
					onClick={() => onDateChange(addDays(selectedDate, 1))}
				>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>

			{/* Правая часть: фильтр по мастерам */}
			<Select value={selectedResource} onValueChange={onResourceChange}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Все мастера' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Все мастера</SelectItem>
					{resources.map(r => (
						<SelectItem key={r.id} value={r.id}>
							{r.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
