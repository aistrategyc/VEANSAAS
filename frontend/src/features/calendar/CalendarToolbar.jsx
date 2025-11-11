import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, subDays, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export function CalendarToolbar({
	viewType,
	onViewTypeChange,
	selectedDate,
	onDateChange,
	dateRange,
	onDateRangeChange,
	selectedResource,
	onResourceChange,
	resources,
}) {
	const handlePrev = () => {
		if (viewType === 'day') onDateChange(subDays(selectedDate, 1))
		else if (viewType === 'week' && dateRange?.from && dateRange?.to) {
			const diff = differenceInDays(dateRange.to, dateRange.from) + 1
			onDateRangeChange({
				from: subDays(dateRange.from, diff),
				to: subDays(dateRange.to, diff),
			})
		}
	}

	const handleNext = () => {
		if (viewType === 'day') onDateChange(addDays(selectedDate, 1))
		else if (viewType === 'week' && dateRange?.from && dateRange?.to) {
			const diff = differenceInDays(dateRange.to, dateRange.from) + 1
			onDateRangeChange({
				from: addDays(dateRange.from, diff),
				to: addDays(dateRange.to, diff),
			})
		}
	}

	const formatRange = () => {
		if (!dateRange?.from || !dateRange?.to) return 'Выберите диапазон'
		return `${format(dateRange.from, 'd MMM', { locale: ru })} — ${format(
			dateRange.to,
			'd MMM yyyy',
			{ locale: ru }
		)}`
	}

	return (
		<div className='flex flex-wrap justify-between items-center gap-4 p-4 bg-card rounded-lg border'>
			{/* Левый блок: стрелки и дата/диапазон */}
			<div className='flex items-center gap-2'>
				<Button variant='outline' size='sm' onClick={handlePrev}>
					<ChevronLeft className='h-4 w-4' />
				</Button>

				{viewType === 'day' ? (
					<Button variant='outline' className='min-w-[200px] justify-start'>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{format(selectedDate, 'd MMMM yyyy', { locale: ru })}
					</Button>
				) : (
					<Popover>
						<PopoverTrigger asChild>
							<Button variant='outline' className='min-w-[240px] justify-start'>
								<CalendarIcon className='mr-2 h-4 w-4' />
								{formatRange()}
							</Button>
						</PopoverTrigger>
						<PopoverContent align='start' className='p-0'>
							<Calendar
								mode='range'
								numberOfMonths={2}
								selected={dateRange}
								onSelect={onDateRangeChange}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				)}

				<Button variant='outline' size='sm' onClick={handleNext}>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>

			{/* Центр: переключатель День/Неделя */}
			<div className='flex items-center gap-2'>
				<Button
					variant={viewType === 'day' ? 'default' : 'outline'}
					size='sm'
					onClick={() => onViewTypeChange('day')}
				>
					День
				</Button>
				<Button
					variant={viewType === 'week' ? 'default' : 'outline'}
					size='sm'
					onClick={() => onViewTypeChange('week')}
				>
					Неделя
				</Button>
			</div>

			{/* Правый блок: фильтр по мастерам */}
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
