import React from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { ErrorInput } from '../../shared/ui/validate/ErrorInput'
import { Button } from '../../shared/ui/button/Button'
import { Form } from '../../shared/ui/form/Form'
import { Input } from '../../shared/ui/input/Input'

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
	})

	const emailError = errors['email']?.message
	const onSubmit = data => {
		console.log(data)
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				title='Username'
				placeholder='Username'
				type='text'
				name={'username'}
				control={control}
			/>
			<FormInput
				title='Password'
				placeholder='Password'
				type='password'
				name={'password'}
				control={control}
			/>
			<Button>Отправить</Button>
		</Form>
	)
}
