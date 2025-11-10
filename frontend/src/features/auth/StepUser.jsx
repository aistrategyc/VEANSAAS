import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import { useEffect } from 'react'

export const StepUser = ({ onNext, initialData = {} }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onChange',
		defaultValues: initialData,
	})

	useEffect(() => {
		reset(initialData)
	}, [initialData, reset])

	return (
		<Form onSubmit={handleSubmit(onNext)} className='space-y-4'>
			<FormInput
				title='Имя'
				name='first_name'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.first_name?.message}
			/>
			<FormInput
				title='Фамилия'
				name='last_name'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.last_name?.message}
			/>
			<FormInput
				title='Username'
				type='text'
				name='username'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.username?.message}
			/>
			<FormInput
				title='Email'
				type='email'
				name='email'
				control={control}
				rules={{
					required: 'Обязательное поле',
					pattern: {
						value: /^\S+@\S+$/i,
						message: 'Введите корректный email',
					},
				}}
				error={errors.email?.message}
			/>
			<FormInput
				title='Телефон'
				type='tel'
				name='phone_number'
				control={control}
				error={errors.phone_number?.message}
			/>
			<FormInput
				title='Пароль'
				type='password'
				name='password'
				control={control}
				rules={{
					required: 'Обязательное поле',
					minLength: {
						value: 6,
						message: 'Пароль должен содержать минимум 6 символов',
					},
				}}
				error={errors.password?.message}
			/>

			<Button type='submit' className='w-full mt-4'>
				Далее
			</Button>
		</Form>
	)
}
