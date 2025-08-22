import React from 'react'
import { Input } from './Input'
import { useController } from 'react-hook-form'

export const FormInput = ({
	title,
	type,
	name,
	control,
	rules = { require: true },
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

	return <Input title={title} type={type} {...field} />
}
