import React from 'react'
import { Input } from './Input'
import { useController } from 'react-hook-form'

export const FormInput = ({
	placeholder,
	title,
	type,
	name,
	control,
	rules = { require: true },
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
		<Input
			error={error}
			placeholder={placeholder}
			title={title}
			type={type}
			{...field}
		/>
	)
}
