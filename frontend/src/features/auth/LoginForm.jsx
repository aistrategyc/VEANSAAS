import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from './lib/validation'
import { Loader } from '@/shared/ui/loader/Loader'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useLogin } from './lib/api'

export const LoginForm = () => {
	const { fetchLogin, isLoading, error } = useLogin()
	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm({
		mode: 'onChange,',
		defaultValues: {
			username: '',
			password: '',
		},
		resolver: yupResolver(schemaLogin),
	})

	if (isLoading) {
		return <Loader />
	}
	return (
		<Form
			onSubmit={handleSubmit(data => fetchLogin(data, reset))}
			className='space-y-4'
		>
			{error && <p className='text-red-500 text-sm h-5 ml-2'>{error}</p>}
			<FormInput
				title='Username'
				type='text'
				name={'username'}
				control={control}
				error={errors.username?.message}
			/>
			<FormInput
				title='Password'
				type='password'
				name={'password'}
				control={control}
				error={errors.password?.message}
			/>
			<div className='flex items-center justify-between pb-2'>
				<Link
					to='/forgot-password'
					className='text-sm text-primary hover:underline'
				>
					Забыли пароль?
				</Link>
			</div>
			<Button type='submit' className='w-full'>
				Send
			</Button>
		</Form>
	)
}
