import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const Filters = ({
	title = 'Поиск и фильтры',
	description = 'Найдите нужные данные по различным критериям',
	searchQuery,
	onSearchChange,
	searchPlaceholder = 'Поиск...',
	filters = [],
	children,
	className = '',
}) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col sm:flex-row gap-4 items-start'>
					<div className='flex-1 w-full'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder={searchPlaceholder}
								value={searchQuery}
								onChange={e => onSearchChange(e.target.value)}
								className='pl-10'
							/>
						</div>
					</div>
					{filters.map(filter => (
						<div key={filter.key} style={{ width: filter.width || '180px' }}>
							{filter.type === 'select' && (
								<Select value={filter.value} onValueChange={filter.onChange}>
									<SelectTrigger>
										<SelectValue
											placeholder={filter.placeholder || filter.label}
										/>
									</SelectTrigger>
									<SelectContent>
										{filter.options?.map(option => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							{filter.type === 'input' && (
								<Input
									placeholder={filter.placeholder || filter.label}
									value={filter.value}
									onChange={e => filter.onChange(e.target.value)}
								/>
							)}
						</div>
					))}
					{children}
				</div>
			</CardContent>
		</Card>
	)
}
