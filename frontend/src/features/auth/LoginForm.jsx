import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Button } from 'shared/ui/button/Button'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from 'shared/schema/schema'
import { useAuth } from '../../app/contexts/AuthProviderContext'
import { api } from 'shared/api/api'

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
	const onSubmit = data => {
		reset()
		api
			.post('auth/login', data)

			.then(response => {
				login(response.access_token, { expires: 7 })
			})
			.catch()
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
