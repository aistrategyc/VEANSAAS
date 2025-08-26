import { useForm } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Button } from 'shared/ui/button/Button'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from 'shared/schema/schema'
import { useApi } from '../../shared/hooks/useApi'
import { useAuth } from '../../app/contexts/AuthProviderContext'

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
	const { post, error, loading } = useApi()

	const onSubmit = async data => {
		reset()
		try {
			const response = await post('auth/login', data)
			console.log(response)
			login(response.access_token, { expires: 7 })
		} catch (err) {
			console.error('login', err)
		}
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
