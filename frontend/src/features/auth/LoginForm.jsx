import { useForm, Controller, useWatch } from 'react-hook-form'
import { FormInput } from 'shared/ui/input/FormInput'
import { Form } from 'shared/ui/form/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaLogin } from './lib/validation'
import { Loader } from '@/shared/ui/loader/Loader'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useLogin } from './model/api'
import { useEffect, useState } from 'react'
import FormSelect from '@/shared/ui/select/Select'

export const LoginForm = () => {
	const { fetchLogin, isLoading, error } = useLogin()
	const [orgs, setOrgs] = useState([])
	const [loadingOrgs, setLoadingOrgs] = useState(false)

	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
		setValue,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			username: '',
			password: '',
			organization: '',
		},
		resolver: yupResolver(schemaLogin),
	})

	const username = useWatch({ control, name: 'username' })

	useEffect(() => {
		const loadOrgs = async () => {
			setLoadingOrgs(true)
			try {
				const userOrgs = [{ value: '1231', label: 'orgee' }]
				setOrgs(userOrgs)
			} catch (err) {
				setOrgs([])
				setValue('organization', '')
			} finally {
				setLoadingOrgs(false)
			}
		}

		const timer = setTimeout(loadOrgs, 500)
		return () => clearTimeout(timer)
	}, [username])

	const onSubmit = data => {
		fetchLogin({ data, reset })
	}

	if (isLoading || loadingOrgs) {
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

			{/* Селект с организациями */}
			{orgs.length > 0 && (
				<FormSelect
					items={orgs || []}
					title='Организация *'
					placeholder='Выберите организацию'
					name='organization'
					control={control}
					error={errors.organization?.message}
				/>
			)}

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
