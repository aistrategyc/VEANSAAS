import * as yup from 'yup'

export const passwordSchema = yup
	.string()
	.required('Password is required')
	.min(8, 'Password must be at least 8 characters')
	.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.matches(/[0-9]/, 'Password must contain at least one number')
	.matches(
		/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
		'Password must contain at least one special character'
	)

export const schemaLogin = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required('Required field')
		.min(3, 'Username must be at least 3 characters'),
	password: passwordSchema,
})

export const schemaRegisterSimple = yup.object().shape({
	username: yup
		.string()
		.required('Username is required')
		.min(3, 'Username must be at least 3 characters')
		.max(30, 'Username must not exceed 30 characters'),

	first_name: yup
		.string()
		.required('First name is required')
		.min(2, 'First name must be at least 2 characters')
		.max(50, 'First name must not exceed 50 characters'),

	last_name: yup
		.string()
		.required('Last name is required')
		.min(2, 'Last name must be at least 2 characters')
		.max(50, 'Last name must not exceed 50 characters'),

	phone_number: yup
		.string()
		.required('Phone number is required')
		.matches(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
	password: passwordSchema,
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required'),
	invite_token: yup.string().required(),
})

export const schemaRegister = yup.object().shape({
	user: yup.object().shape({
		username: yup
			.string()
			.required('Username is required')
			.min(3, 'Username must be at least 3 characters')
			.max(30, 'Username must not exceed 30 characters'),

		email: yup
			.string()
			.required('Email is required')
			.email('Please enter a valid email address')
			.max(100, 'Email must not exceed 100 characters'),

		first_name: yup
			.string()
			.required('First name is required')
			.min(2, 'First name must be at least 2 characters')
			.max(50, 'First name must not exceed 50 characters'),

		last_name: yup
			.string()
			.required('Last name is required')
			.min(2, 'Last name must be at least 2 characters')
			.max(50, 'Last name must not exceed 50 characters'),

		phone_number: yup
			.string()
			.required('Phone number is required')
			.matches(
				/^\+?[0-9]{10,15}$/,
				'Please enter a valid phone number (10-15 digits, optional + prefix)'
			),

		password: passwordSchema,
	}),

	organization: yup.object().shape({
		name: yup
			.string()
			.required('Organization name is required')
			.min(2, 'Organization name must be at least 2 characters')
			.max(100, 'Organization name must not exceed 100 characters'),

		description: yup
			.string()
			.max(500, 'Description must not exceed 500 characters')
			.nullable(),

		plan_type: yup
			.string()
			.required('Plan type is required')
			.oneOf(['solo', 'network'], 'Please select a valid plan type'),

		studio: yup.object().shape({
			name: yup
				.string()
				.required('Studio name is required')
				.min(2, 'Studio name must be at least 2 characters')
				.max(100, 'Studio name must not exceed 100 characters'),
		}),
	}),
})
