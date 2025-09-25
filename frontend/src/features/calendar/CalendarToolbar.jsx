import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Users,
	MapPin,
} from 'lucide-react'
import {
	format,
	addDays,
	addWeeks,
	addMonths,
	subDays,
	subWeeks,
	subMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'

export function CalendarToolbar({
	selectedDate,
	onDateChange,
	viewType,
	onViewTypeChange,
	resourceType,
	onResourceTypeChange,
	selectedResource,
	onResourceChange,
	resources,
}) {
	const navigateDate = direction => {
		let newDate

		if (direction === 'prev') {
			switch (viewType) {
				case 'day':
					newDate = subDays(selectedDate, 1)
					break
				case 'week':
					newDate = subWeeks(selectedDate, 1)
					break
				case 'month':
					newDate = subMonths(selectedDate, 1)
					break
			}
		} else {
			switch (viewType) {
				case 'day':
					newDate = addDays(selectedDate, 1)
					break
				case 'week':
					newDate = addWeeks(selectedDate, 1)
					break
				case 'month':
					newDate = addMonths(selectedDate, 1)
					break
			}
		}

		onDateChange(newDate)
	}

	const getDateRangeText = () => {
		switch (viewType) {
			case 'day':
				return format(selectedDate, 'd MMMM yyyy', { locale: ru })
			case 'week':
				const weekStart = subDays(selectedDate, selectedDate.getDay())
				const weekEnd = addDays(weekStart, 6)
				return `${format(weekStart, 'd MMM', { locale: ru })} - ${format(
					weekEnd,
					'd MMM yyyy',
					{ locale: ru }
				)}`
			case 'month':
				return format(selectedDate, 'MMMM yyyy', { locale: ru })
		}
	}

	return (
		<div className='flex flex-col  sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-lg border'>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => navigateDate('prev')}
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className='min-w-[200px] justify-start bg-transparent'
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{getDateRangeText()}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						<Calendar
							mode='single'
							selected={selectedDate}
							onSelect={date => date && onDateChange(date)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				<Button
					variant='outline'
					size='sm'
					onClick={() => navigateDate('next')}
				>
					<ChevronRight className='h-4 w-4' />
				</Button>

				<Button
					variant='outline'
					size='sm'
					onClick={() => onDateChange(new Date())}
				>
					Сегодня
				</Button>
			</div>

			{/* View Controls */}
			<div className='flex flex-wrap items-center gap-4'>
				{/* Resource Type Toggle */}
				<div className='flex flex-wrap items-center gap-2'>
					<Button
						variant={resourceType === 'master' ? 'default' : 'outline'}
						size='sm'
						onClick={() => onResourceTypeChange('master')}
					>
						<Users className='h-4 w-4 mr-1' />
						Мастера
					</Button>
					<Button
						variant={resourceType === 'space' ? 'default' : 'outline'}
						size='sm'
						onClick={() => onResourceTypeChange('space')}
					>
						<MapPin className='h-4 w-4 mr-1' />
						Места
					</Button>
				</div>

				{/* Resource Filter */}
				<Select value={selectedResource} onValueChange={onResourceChange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Все ресурсы' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>
							Все {resourceType === 'master' ? 'мастера' : 'места'}
						</SelectItem>
						{resources.map(resource => (
							<SelectItem key={resource.id} value={resource.id}>
								{resource.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* View Type */}
				<div className='flex items-center gap-1 border rounded-md p-1'>
					<Button
						variant={viewType === 'day' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewTypeChange('day')}
					>
						День
					</Button>
					<Button
						variant={viewType === 'week' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewTypeChange('week')}
					>
						Неделя
					</Button>
					<Button
						variant={viewType === 'month' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewTypeChange('month')}
					>
						Месяц
					</Button>
				</div>
			</div>
		</div>
	)
}
