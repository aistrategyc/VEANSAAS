import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Button } from 'shared/ui/button/Button'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from 'shared/schema/schema'
import { useAuth } from '../../shared/hooks/useAuth'
import { useApi } from '../../shared/hooks/useApi'
import { Loader } from '../../shared/ui/loader/Loader'
import { useEffect } from 'react'
import { showAlert } from '../../shared/ui/alert/Alerts'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../../shared/slices/userSlice'

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

	const { login } = useAuth()
	const { loading, error, post, reset: resetApi } = useApi()
	const dispatch = useDispatch()

	const onSubmit = data => {
		reset()
		post('auth/login', data)
			.then(response => {
				login(response.data.access_token, { expires: 7 })
				dispatch(fetchUserData()).unwrap()
				showAlert.success('Welcome')
			})
			.catch({})
	}

	useEffect(() => {
		if (error) {
			showAlert.error('Error', error).then(() => {
				resetApi()
			})
		}
	}, [error, resetApi])

	if (loading) {
		return <Loader />
	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				title='Username'
				placeholder='Username'
				type='text'
				name={'username'}
				control={control}
				error={errors.username?.message}
			/>
			<FormInput
				title='Password'
				placeholder='Password'
				type='password'
				name={'password'}
				control={control}
				error={errors.password?.message}
			/>
			<Button>Send</Button>
		</Form>
	)
}
