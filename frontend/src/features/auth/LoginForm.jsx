import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { Button } from '../../shared/ui/button/Button'
import { Form } from '../../shared/ui/form/Form'
import { useAuth } from '../../shared/hooks/useAuth'
import { useNavigate } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from '../../shared/schema/schema'

// redux - token хранить
// хук для запросов
// эндпойпт и роли

export const LoginForm = () => {
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		mode: 'onChange,',
		defaultValues: {
			username: '',
			password: '',
		},
		resolver: yupResolver(schemaLogin),
	})

	const navigate = useNavigate()
	const { login, error } = useAuth()

	const onSubmit = async data => {
		login(data)
			.unwrap()
			.then(() => {
				navigate('/')
			})
			.catch(error => {
				console.log(error)
			})
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
