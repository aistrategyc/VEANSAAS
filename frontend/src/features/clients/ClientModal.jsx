import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import { SEX_TYPES } from './lib/constants'
import DatePickerWithInput from '@/shared/ui/DatePickerWithInput'
import FormSwitch from '@/shared/ui/switch/FormSwitch'
import FormFileInput from '@/shared/ui/FormFileInput'

export function ClientModal({
	isOpen,
	onClose,
	handleCreate,
	handleUpdate,
	client = null,
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			phone_number: '',
			dateOfBirth: '',
			gender: '',
			notes: '',
			is_active: true,
		},
	})

	useEffect(() => {
		if (isOpen) {
			if (client) {
				reset({
					first_name: client.first_name,
					last_name: client.last_name,
					email: client.email || '',
					phone_number: client.phone_number || '',
					dateOfBirth: client.dateOfBirth || '',
					gender: client.gender || '',
					notes: client.notes || '',
					is_active: client.is_active || true,
				})
			} else {
				reset({
					first_name: '',
					last_name: '',
					email: '',
					phone_number: '',
					dateOfBirth: '',
					gender: '',
					notes: '',
					is_active: true,
				})
			}
		}
	}, [client, isOpen, reset])

	const onSubmit = data => {
		if (client) {
			handleUpdate(client.uuid, data)
		} else {
			handleCreate(data)
		}
		reset()
		onClose()
	}

	const title = client ? 'Редактировать клиента' : 'Новый клиент'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormInput
						title='Имя *'
						placeholder='Введите имя'
						type='text'
						name='first_name'
						control={control}
						rules={{ required: 'Имя обязательно' }}
						error={errors.first_name?.message}
					/>

					<FormInput
						title='Фамилия *'
						placeholder='Введите фамилию'
						type='text'
						name='last_name'
						control={control}
						rules={{ required: 'Фамилия обязательна' }}
						error={errors.last_name?.message}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormInput
						title='Email'
						placeholder='client@example.com'
						type='email'
						name='email'
						control={control}
						rules={{
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Некорректный email',
							},
						}}
						error={errors.email?.message}
					/>

					<FormInput
						title='Phone number'
						type='tel'
						name='phone_number'
						control={control}
						error={errors.phone_number?.message}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<DatePickerWithInput name='dateOfBirth' control={control} />

					<FormSelect
						items={SEX_TYPES}
						title='Пол'
						placeholder='Выберите пол'
						name='gender'
						control={control}
						error={errors.gender?.message}
					/>
				</div>
				<FormInput
					title='Заметки'
					placeholder='Дополнительная информация о клиенте...'
					type='textarea'
					name='notes'
					control={control}
					rows={3}
					className='resize-none min-h-[80px]'
					error={errors.notes?.message}
				/>
				<FormFileInput
					title='Картинка профиля'
					name='avatar'
					control={control}
					accept='image/*'
					error={errors.avatar?.message}
				/>
				<FormSwitch
					title={'Активный клиент'}
					control={control}
					name={'is_active'}
				/>

				<div className='flex items-center justify-end space-x-2 pt-4'>
					<Button type='button' variant='outline' onClick={onClose}>
						Отмена
					</Button>
					<Button type='submit'>Сохранить</Button>
				</div>
			</Form>
		</DialogWrapper>
	)
}
