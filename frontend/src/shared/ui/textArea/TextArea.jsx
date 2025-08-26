import React from 'react'
import { useController } from 'react-hook-form'

export const TextArea = ({
	placeholder,
	title,
	name,
	control,
	rules = { require: true },
	rows = 3,
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
		<div>
			<label className='block text-gray-500 divider-text'>{title}</label>
			<textarea
				rows={rows}
				placeholder={placeholder}
				title={title}
				{...field}
			/>
		</div>
	)
}
