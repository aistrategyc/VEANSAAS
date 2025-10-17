import { useController } from 'react-hook-form'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export const SelectForm = ({
	items,
	title,
	name,
	control,
	placeholder = title,
	rules = { required: 'Error' },
	error,
}) => {
	const {
		field,
		fieldState: { invalid, isTouched, isDirty },
		formState: { touchedFields, dirtyFields },
	} = useController({
		name,
		control,
		rules,
	})

	return (
		<div className='space-y-2'>
			<div className='flex items-center'>
				<Label>{title}</Label>{' '}
				<p className='text-red-500 text-sm h-5 ml-2'>{error}</p>
			</div>
			<Select
				value={field.value}
				onValueChange={field.onChange}
				className='w-full px-3 text-gray-500 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
			>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map(item => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
