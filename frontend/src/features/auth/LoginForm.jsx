import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { ErrorInput } from '../../shared/ui/validate/ErrorInput'
import { Button } from '../../shared/ui/button/Button'
import { Form } from '../../shared/ui/form/Form'
import { Input } from '../../shared/ui/input/Input'
import authService from '../../shared/service/auth.service'

// redux - token хранить
// хук для запросов
// эндпойпт и роли

export const LoginForm = () => {
	const [userLogin, setUserLogin] = useState({
		username: '',
		password: '',
	})



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
	const onSubmit = async data => {
		console.log(data)
		setUserLogin({ username: data.username, password: data.password })
		await authService.login(data)
		console.log(userLogin)
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
