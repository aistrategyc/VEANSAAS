
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'

export function AttributeField({ attribute, control, index, errors }) {
	const commonProps = {
		title: attribute.name + (attribute.is_required ? ' *' : ''),
		control: control,
	}

	if (attribute.type === 'text') {
		return (
			<FormInput
				{...commonProps}
				placeholder={`Введите ${attribute.name.toLowerCase()}`}
				type='text'
				name={`attributes.${index}.value`}
				error={errors.attributes?.[index]?.value?.message}
			/>
		)
	}

	if (attribute.type === 'number') {
		return (
			<FormInput
				{...commonProps}
				placeholder={`Введите ${attribute.name.toLowerCase()}`}
				type='number'
				name={`attributes.${index}.value`}
				error={errors.attributes?.[index]?.value?.message}
			/>
		)
	}

	if (attribute.type === 'boolean') {
		return (
			<BooleanAttributeField
				attribute={attribute}
				control={control}
				index={index}
			/>
		)
	}

	if (attribute.type === 'select') {
		return (
			<SelectAttributeField
				attribute={attribute}
				control={control}
				index={index}
				errors={errors}
				commonProps={commonProps}
			/>
		)
	}

	return (
		<FormInput
			{...commonProps}
			placeholder={`Введите ${attribute.name.toLowerCase()}`}
			type='text'
			name={`attributes.${index}.value`}
			error={errors.attributes?.[index]?.value?.message}
		/>
	)
}

function BooleanAttributeField({ attribute, control, index }) {
	const { setValue } = control

	return (
		<div className='flex items-center space-x-2'>
			<label className='text-sm font-medium'>{attribute.name}</label>
			<input
				type='checkbox'
				{...control.register(`attributes.${index}.value`)}
				defaultValue='false'
				onChange={e => {
					setValue(
						`attributes.${index}.value`,
						e.target.checked ? 'true' : 'false'
					)
				}}
				className='h-4 w-4 rounded border-gray-300'
			/>
		</div>
	)
}

function SelectAttributeField({
	attribute,
	control,
	index,
	errors,
	commonProps,
}) {
	const options =
		attribute.attribute_options?.map(option => ({
			value: option.uuid,
			label: option.value,
		})) || []

	return (
		<FormSelect
			{...commonProps}
			items={options}
			placeholder={`Выберите ${attribute.name.toLowerCase()}`}
			name={`attributes.${index}.option_uuid`}
			error={errors.attributes?.[index]?.option_uuid?.message}
		/>
	)
}
