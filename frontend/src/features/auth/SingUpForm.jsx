import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormInput } from '@/shared/ui/input/FormInput'
import { Form } from '@/shared/ui/form/Form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SelectForm } from '@/shared/ui/select/Select'
import { Loader } from '@/shared/ui/loader/Loader'
import { useSignup } from './model/api'
import { schemaRegister } from './lib/validation'
import { PLANS } from './lib/constants'
import { cn } from '@/lib/utils'

export const SingUpForm = () => {
	const { fetchSignup, isLoading, error } = useSignup()

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			user: {
				username: '',
				email: '',
				first_name: '',
				last_name: '',
				phone_number: '',
				password: '',
			},
			organization: {
				name: '',
				description: '',
				plan_type: '',
				studio: {
					name: '',
				},
			},
		},
		resolver: yupResolver(schemaRegister),
	})

	const hasPersonErrors = errors.hasOwnProperty('user')
	const hasOrgErrors = errors.hasOwnProperty('organization')

	if (isLoading) {
		return <Loader />
	}
	return (
		<Tabs defaultValue='person' className='w-full'>
			<TabsList className='grid w-full grid-cols-2'>
				<TabsTrigger
					value='person'
					className={cn(hasPersonErrors && 'border-destructive border-2')}
				>
					Person
				</TabsTrigger>
				<TabsTrigger
					value='organization'
					className={cn(hasOrgErrors && ' border-destructive border-2')}
				>
					Organization
				</TabsTrigger>
			</TabsList>

			<Form
				onSubmit={handleSubmit(data =>
					fetchSignup({ data: data, reset: reset })
				)}
			>
				{error && <p className='text-red-500 text-sm h-5 ml-2'>{error}</p>}
				<TabsContent value='person'>
					<FormInput
						title='First name'
						type='text'
						name='user.first_name'
						control={control}
						error={errors.user?.first_name?.message}
					/>
					<FormInput
						title='Last name'
						type='text'
						name='user.last_name'
						control={control}
						error={errors.user?.last_name?.message}
					/>
					<FormInput
						title='Username'
						type='text'
						name='user.username'
						control={control}
						error={errors.user?.username?.message}
					/>
					<FormInput
						title='Email'
						type='text'
						name='user.email'
						control={control}
						error={errors.user?.email?.message}
					/>
					<FormInput
						title='Phone number'
						type='tel'
						name='user.phone_number'
						control={control}
						error={errors.user?.phone_number?.message}
					/>
					<FormInput
						title='Password'
						type='password'
						name='user.password'
						control={control}
						error={errors.user?.password?.message}
					/>
				</TabsContent>
				<TabsContent value='organization'>
					<FormInput
						title='Name organization'
						type='text'
						name='organization.name'
						control={control}
						error={errors.organization?.name?.message}
					/>
					<SelectForm
						item={PLANS}
						title='Choose plan'
						name='organization.plan_type'
						control={control}
						error={errors.organization?.plan_type?.message}
					/>
					<FormInput
						title='Description'
						type='text'
						name='organization.description'
						control={control}
						error={errors.organization?.description?.message}
					/>
					<FormInput
						title='Studio name'
						type='text'
						name='organization.studio.name'
						control={control}
						error={errors.organization?.studio?.name?.message}
					/>
				</TabsContent>
				<Button type='submit' className='w-full mt-2'>
					Send
				</Button>
			</Form>
		</Tabs>
	)
}
