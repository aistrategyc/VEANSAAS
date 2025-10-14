import { Button } from '@/components/ui/button'

import { schemaRegisterSimple } from './lib/validation'
import { useSignupByInvite } from './lib/api'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import { useSearchParams } from 'react-router-dom'
import { Loader } from '@/shared/ui/loader/Loader'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

export const SingUpSimpleForm = () => {
	const [searchParams] = useSearchParams()
	const inviteToken = searchParams.get('token')
	const { fetchSignup, isLoading, error } = useSignupByInvite()

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			username: '',
			first_name: '',
			last_name: '',
			phone_number: '',
			password: '',
			confirmPassword: '',
			invite_token: inviteToken,
		},
		resolver: yupResolver(schemaRegisterSimple),
	})

	const onSubmit = data => {
		const { confirmPassword, ...submitData } = data
		fetchSignup({ data: submitData, reset: reset })
	}

	if (isLoading) {
		return <Loader />
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			{error && <p className='text-red-500 text-sm h-5 ml-2'>{error}</p>}
			<FormInput
				title='First name'
				type='text'
				name='first_name'
				control={control}
				error={errors.first_name?.message}
			/>
			<FormInput
				title='Last name'
				type='text'
				name='last_name'
				control={control}
				error={errors.last_name?.message}
			/>
			<FormInput
				title='Username'
				type='text'
				name='username'
				control={control}
				error={errors.username?.message}
			/>
			<FormInput
				title='Phone number'
				type='tel'
				name='phone_number'
				control={control}
				error={errors.phone_number?.message}
			/>
			<FormInput
				title='Password'
				type='password'
				name='password'
				control={control}
				error={errors.password?.message}
			/>
			<FormInput
				title='Confirm Password'
				type='password'
				name='confirmPassword'
				control={control}
				error={errors.confirmPassword?.message}
			/>

			<Button type='submit' className='w-full mt-2'>
				Send
			</Button>
		</Form>
	)
}
