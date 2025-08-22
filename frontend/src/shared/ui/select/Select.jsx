import React from 'react'
import { useController } from 'react-hook-form'

export const Select = ({
	plans,
	title,
	name,
	control,
	rules = { require: 'Choose plan' },
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
		<>
			<label className='block text-gray-500 divider-text'>{title}</label>
			<select
				{...field}
				className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
			>
				<option value=''>Choose plan</option>
				{plans.map(plan => (
					<option key={plan.value} value={plan.value}>
						{plan.label}
					</option>
				))}
			</select>
		</>
	)
}
