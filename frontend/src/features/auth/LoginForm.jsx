import React from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { ErrorInput } from '../../shared/ui/validate/ErrorInput'
import { Button } from '../../shared/ui/button/Button'
import { Form } from '../../shared/ui/form/Form'
import { Input } from '../../shared/ui/input/Input'

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		mode: 'onChange,',
	})

	const emailError = errors['email']?.message
	const onSubmit = data => {
		console.log(data)
	}

	return (
		// <form
		// 	className='flex flex-col justify-between h-[100%]'
		// 	onSubmit={handleSubmit(onSubmit)}
		// >
		// 	<FormInput
		// 		required
		// 		title='Email'
		// 		type='text'
		// 		placeholder='Email'
		// 		{...register('email', {
		// 			required: 'Поле обязательное',
		// 			pattern: {
		// 				value: /^[A-Z0-9._%+-]+@[A-Z0-9. -]+\.[A-Z]{2,4}$/i,
		// 				message: 'Error',
		// 			},
		// 		})}
		// 	/>
		// 	{/* {emailError && <ErrorInput title={'Неверный email'} />} */}
		// 	<FormInput
		// 		required
		// 		title='Password'
		// 		type='password'
		// 		placeholder='Password'
		// 		{...register('password', {
		// 			required: true,
		// 		})}
		// 	/>

		// 	<FormButton>Отправить</FormButton>
		// </form>

		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormInput title='Email' type='email' name={'email'} control={control} />
			<FormInput
				title='Password'
				type='password'
				name={'password'}
				control={control}
			/>
			<Button>Отправить</Button>
		</Form>
	)
}
