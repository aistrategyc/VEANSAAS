import React from 'react'
import { Input } from './Input'
import { useController } from 'react-hook-form'
import { Label } from '@/components/ui/label'

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
		<div className='space-y-2 mt-2 mb-1'>
			<div className='flex items-center'>
				<Label htmlFor='login-email'>{title}</Label>{' '}
				<p className='text-red-500 text-sm h-5 ml-2'>{error}</p>
			</div>

			<Input error={error} placeholder={placeholder} type={type} {...field} />
		</div>
	)
}
