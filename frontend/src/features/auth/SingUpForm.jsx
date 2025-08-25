import React from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { Button } from '../../shared/ui/button/Button'
import { Form } from '../../shared/ui/form/Form'
import { Select } from '../../shared/ui/select/Select'

const plans = [
	{ value: 'low', label: 'low' },
	{ value: 'high', label: 'high' },
	{ value: 'medium', label: 'medium' },
]

export const SingUpForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange,',
		defaultValues: {
			confirmPassword: '',
			description: '',
			firstName: '',
			lastName: '',
			nameOrganization: '',
			password: '',
			phoneNumber: '',
			planType: '',
			studioName: '',
			username: '',
		},
	})

	const emailError = errors['email']?.message
	const onSubmit = data => {
		console.log(data)
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col items-center bg-gray-100 rounded-2xl p-5'>
				<div className='flex justify-between'>
					<div className='bg-fuchsia-100 mx-auto p-10 pt-3 shadow'>
						<h2 className='text-gray-700 text-2xl font-bold text-center'>
							Person
						</h2>
						<div className='flex justify-between w-95'>
							<FormInput
								title='First name'
								placeholder='First name'
								type='text'
								name='firstName'
								control={control}
							/>
							<FormInput
								title='Last name'
								placeholder='Last name'
								type='text'
								name='lastName'
								control={control}
							/>
						</div>
						<FormInput
							title='Username'
							placeholder='Username'
							type='text'
							name='username'
							control={control}
						/>
						<FormInput
							title='Phone number'
							placeholder='Number'
							type='tel'
							name='phoneNumber'
							control={control}
						/>
						<FormInput
							title='Password'
							placeholder='Password'
							type='password'
							name='password'
							control={control}
						/>
						<FormInput
							title='Confirm password'
							placeholder='Confirm password'
							type='password'
							name='confirmPassword'
							control={control}
						/>
					</div>
					<div className='max-w-xl h- bg-gray-100 mx-auto p-10 pt-3 shadow'>
						<h2 className='text-gray-700 text-2xl font-bold text-center'>
							Organization
						</h2>
						<FormInput
							title='Name organization'
							placeholder='Name organization'
							type='text'
							name='nameOrganization'
							control={control}
						/>
						<Select
							plans={plans}
							title='Choose plan'
							name='planType'
							control={control}
						/>
						<FormInput
							title='Description'
							placeholder='Description'
							type='text'
							name='description'
							control={control}
						/>
						<FormInput
							title='Studio name'
							placeholder='Studio name'
							type='text'
							name='studioName'
							control={control}
						/>
					</div>
				</div>
				<div className='w-60 mt-4'>
					<Button>Send</Button>
				</div>
			</div>
		</Form>
	)
}
