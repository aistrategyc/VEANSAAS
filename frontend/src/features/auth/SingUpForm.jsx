import React from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Button } from 'shared/ui/button/Button'
import { Form } from 'shared/ui/form/Form'
import { Select } from 'shared/ui/select/Select'
import { useAuth } from 'shared/hooks/useAuth'
import { useNavigate } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaRegister } from 'shared/schema/schema'

const plans = [
	{ value: 'solo', label: 'solo' },
	{ value: 'network', label: 'network' },
]

export const SingUpForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			user: {
				username: '',
				email: '',
				first_name: '',
				last_name: '',
				phone_number: '',
				password: '',
			},
			organization: {
				name: '',
				description: '',
				plan_type: '',
				studio: {
					name: '',
				},
			},
		},
		resolver: yupResolver(schemaRegister),
	})

	const navigate = useNavigate()
	const { register, registerSuccess } = useAuth()

	// const emailError = errors['email']?.message
	const onSubmit = data => {
		register(data)
			.unwrap()
			.then(() => {
				navigate('/')
			})
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
								name='user.first_name'
								control={control}
								error={errors.user?.first_name?.message}
							/>
							<FormInput
								title='Last name'
								placeholder='Last name'
								type='text'
								name='user.last_name'
								control={control}
								error={errors.user?.last_name?.message}
							/>
						</div>
						<FormInput
							title='Username'
							placeholder='Username'
							type='text'
							name='user.username'
							control={control}
							error={errors.user?.username?.message}
						/>
						<FormInput
							title='Email'
							placeholder='Email'
							type='text'
							name='user.email'
							control={control}
							error={errors.user?.email?.message}
						/>
						<FormInput
							title='Phone number'
							placeholder='Number'
							type='tel'
							name='user.phone_number'
							control={control}
							error={errors.user?.phone_number?.message}
						/>
						<FormInput
							title='Password'
							placeholder='Password'
							type='password'
							name='user.password'
							control={control}
							error={errors.user?.password?.message}
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
							name='organization.name'
							control={control}
							error={errors.organization?.name?.message}
						/>
						<Select
							plans={plans}
							title='Choose plan'
							name='organization.plan_type'
							control={control}
							error={errors.organization?.plan_type?.message}
						/>
						<FormInput
							title='Description'
							placeholder='Description'
							type='text'
							name='organization.description'
							control={control}
							error={errors.organization?.description?.message}
						/>
						<FormInput
							title='Studio name'
							placeholder='Studio name'
							type='text'
							name='organization.studio.name'
							control={control}
							error={errors.organization?.studio?.name?.message}
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
