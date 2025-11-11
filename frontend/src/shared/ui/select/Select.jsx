import { useController } from 'react-hook-form'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const FormSelect = ({
	items,
	title,
	name,
	control,
	placeholder = title,
	rules = { required: 'Error' },
	error,
	returnObject = false,
}) => {
	const {
		field: { value, onChange },
	} = useController({
		name,
		control,
		rules,
	})

	const handleChange = selectedValue => {
		if (returnObject) {
			const selectedItem = items.find(
				item => item.value === selectedValue || item.uuid === selectedValue
			)
			onChange(selectedItem || null)
		} else {
			onChange(selectedValue)
		}
	}

	const currentValue = returnObject
		? value?.value || value?.uuid || ''
		: value || ''

	return (
		<div className='space-y-2 mt-2 mb-4'>
			<div className='flex items-center'>
				<Label>{title}</Label>
				<p className='text-red-500 text-sm h-5 ml-2'>{error}</p>
			</div>

			<Select value={currentValue} onValueChange={handleChange}>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map(item => (
							<SelectItem
								key={item.value || item.uuid}
								value={item.value || item.uuid}
							>
								{item.label ||
									(item.first_name && item.last_name
										? `${item.first_name} ${item.last_name}`
										: null) ||
									item.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}

export default FormSelect
