import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from 'shared/schema/schema'
import { useAuth } from '../../shared/hooks/useAuth'
import { useApi } from '../../shared/hooks/useApi'
import { Loader } from '../../shared/ui/loader/Loader'
import { showAlert } from '../../shared/ui/alert/Alerts'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../../shared/slices/userSlice'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { fetchStudios } from '@/shared/slices/studiosSlice'

export const LoginForm = () => {
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
	const [error, setError] = useState('')
	const { login } = useAuth()
	const { loading, post, reset: resetApi } = useApi()
	const dispatch = useDispatch()

	const onSubmit = data => {
		post('auth/login', data)
			.then(response => {
				login(response.data.access_token, response.data.refresh_token, {
					expires: 7,
				})
				dispatch(fetchUserData()).unwrap()
				dispatch(fetchStudios()).unwrap()
				reset()
			})
			.catch(err => {
				setError(err.response.data.detail)
			})
	}

	if (loading) {
		return <Loader />
	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
