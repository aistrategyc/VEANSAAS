import * as yup from 'yup'

export const schemaStudio = yup.object().shape({
	name: yup
		.string()
		.required('Name is required')
		.min(3, 'Name must be at least 3 characters')
		.max(255, 'Name must not exceed 30 characters'),

	phone_number: yup
		.string()
		.optional()
		.nullable()
		.matches(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),

	address: yup
		.string()
		.optional()
		.nullable()
		.min(3, 'Address must be at least 3 characters'),
})
