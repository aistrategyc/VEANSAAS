import React from 'react'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../shared/ui/input/FormInput'
import { ErrorInput } from '../../shared/ui/validate/ErrorInput'
import { Button } from '../../shared/ui/button/Button'

export const SingUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange,',
	})

	const emailError = errors['email']?.message
	const onSubmit = data => {
		console.log(data)
	}

	return (
		<form
			className='flex flex-col justify-between h-[100%] w-95'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='flex justify-between'>
				<FormInput
					required
					title='First Name'
					placeholder='First name'
					{...register('FirstName', {
						required: true,
					})}
				/>
				<FormInput
					required
					title='Last name'
					placeholder='Last name'
					{...register('LastName', {
						required: true,
					})}
				/>
			</div>
			<FormInput
				required
				title='Username'
				placeholder='Username'
				{...register('Username', {
					required: true,
				})}
			/>
			<FormInput
				required
				title='Email'
				type='text'
				placeholder='Email'
				{...register('email', {
					required: 'Поле обязательное',
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9. -]+\.[A-Z]{2,4}$/i,
						message: 'Error',
					},
				})}
			/>
			{/* {emailError && <ErrorInput title={'Неверный email'} />} */}
			<FormInput
				required
				type='tel'
				title='Phone number'
				placeholder='Phone number'
				{...register('PhoneNumber', {
					required: true,
				})}
			/>
			<FormInput
				required
				title='Password'
				type='password'
				placeholder='Password'
				{...register('password', {
					required: true,
				})}
			/>
			<FormInput
				required
				title='Confirm password'
				type='password'
				placeholder='Confirm Password'
				{...register('confirmPassword', {
					required: true,
				})}
			/>

			<h2 className='m-auto mt-2 text-gray-700 text-xl font-bold text-center'>
				Organization
			</h2>

			<FormInput
				required
				title='Name organization'
				placeholder='Name organization'
				{...register('NameOrganization', {
					required: true,
				})}
			/>
			<div>
				<label htmlFor='category' className='block text-gray-500 divider-text'>
					Plan
				</label>
				<select
					id='category'
					{...register('category', {
						required: 'Пожалуйста, выберите категорию',
					})}
					className='border shadow text-neutral-600 text-sm rounded-md focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 mb-0'
				>
					<option value=''>Plan</option>
					<option value='tech'>Технологии</option>
					<option value='design'>Дизайн</option>
					<option value='marketing'>Маркетинг</option>
				</select>
			</div>
			<FormInput
				required
				title='Studio name'
				placeholder='Studio name'
				{...register('StudioName', {
					required: true,
				})}
			/>
			<Button>Отправить</Button>
		</form>
	)
}
