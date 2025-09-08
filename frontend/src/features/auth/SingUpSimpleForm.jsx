import { Button } from '@/components/ui/button'
import { useApi } from '@/shared/hooks/useApi'
import { schemaRegisterSimple } from '@/shared/schema/schema'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import { Loader } from '@/shared/ui/loader/Loader'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

export const SingUpSimpleForm = () => {
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
			invite_token: '211e2f1dc63d32b1880e9b0f865c2d69',
		},
		resolver: yupResolver(schemaRegisterSimple),
	})

	const { loading, error, post, reset: resetApi } = useApi()

	const onSubmit = data => {
		const { confirmPassword, ...submitData } = data
		post('auth/register-by-invite', submitData)
			.then(() => {
				showAlert.successRegister().then(() => navigate('/login'))
				reset()
			})
			.catch()
	}

	if (loading) {
		return <Loader />
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
