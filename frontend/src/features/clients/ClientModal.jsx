'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import { SelectForm } from '@/shared/ui/select/Select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import { PREFERENCES_TYPES, SEX_TYPES } from './lib/constants'
import AllergyInput from './lib/AllergyInput'
import { DatePickerWithInput } from '../../shared/ui/DatePickerWithInput'
import { PhoneInput } from '@/components/ui/phone-input'

export function ClientModal({ isOpen, onClose, client, onSave }) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
		trigger,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			dateOfBirth: '',
			gender: '',
			notes: '',
			isActive: true,
			preferences: {
				preferredMasters: [],
				allergies: [],
				skinType: '',
			},
		},
	})

	const [isActive, allergies, skinType] = watch([
		'isActive',
		'preferences.allergies',
		'preferences.skinType',
	])

	useEffect(() => {
		if (isOpen) {
			if (client) {
				reset({
					firstName: client.firstName,
					lastName: client.lastName,
					email: client.email || '',
					phone: client.phone || '',
					dateOfBirth: client.dateOfBirth || '',
					gender: client.gender || '',
					notes: client.notes || '',
					isActive: client.isActive,
					preferences: {
						preferredMasters: client.preferences?.preferredMasters || [],
						allergies: client.preferences?.allergies || [],
						skinType: client.preferences?.skinType || '',
					},
				})
			} else {
				reset({
					firstName: '',
					lastName: '',
					email: '',
					phone: '',
					dateOfBirth: '',
					gender: '',
					notes: '',
					isActive: true,
					preferences: {
						preferredMasters: [],
						allergies: [],
						skinType: '',
					},
				})
			}
		}
	}, [client, isOpen, reset])

	const onSubmit = data => {
		const clientData = {
			...data,
			email: data.email || undefined,
			phone: data.phone || undefined,
			dateOfBirth: data.dateOfBirth || undefined,
			gender: data.gender || undefined,
			notes: data.notes || undefined,
			preferences: {
				...data.preferences,
				preferredMasters:
					data.preferences.preferredMasters.length > 0
						? data.preferences.preferredMasters
						: undefined,
				allergies:
					data.preferences.allergies.length > 0
						? data.preferences.allergies
						: undefined,
				skinType: data.preferences.skinType || undefined,
			},
		}

		onSave(clientData)
	}

	const addAllergy = newAllergy => {
		if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
			const updatedAllergies = [...allergies, newAllergy.trim()]
			setValue('preferences.allergies', updatedAllergies)
			trigger('preferences.allergies')
		}
	}

	const removeAllergy = allergy => {
		const updatedAllergies = allergies.filter(a => a !== allergy)
		setValue('preferences.allergies', updatedAllergies)
		trigger('preferences.allergies')
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
						name='firstName'
						control={control}
						rules={{ required: 'Имя обязательно' }}
						error={errors.firstName?.message}
					/>

					<FormInput
						title='Фамилия *'
						placeholder='Введите фамилию'
						type='text'
						name='lastName'
						control={control}
						rules={{ required: 'Фамилия обязательна' }}
						error={errors.lastName?.message}
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
					<DatePickerWithInput
						value={watch('dateOfBirth')}
						onChange={date => {
							setValue('dateOfBirth', date)
						}}
					/>

					<SelectForm
						items={SEX_TYPES}
						title='Пол'
						placeholder='Выберите пол'
						name='gender'
						control={control}
						error={errors.gender?.message}
					/>
				</div>
				<div className='space-y-4'>
					<h3 className='text-lg font-medium'>Предпочтения</h3>

					<SelectForm
						items={PREFERENCES_TYPES}
						title='Тип кожи'
						placeholder='Выберите тип кожи'
						name='preferences.skinType'
						control={control}
						error={errors.preferences?.skinType?.message}
					/>

					<AllergyInput
						allergies={allergies}
						onAdd={addAllergy}
						onRemove={removeAllergy}
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

				<div className='flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border'>
					<Switch
						id='isActive'
						checked={isActive}
						onCheckedChange={checked => setValue('isActive', checked)}
					/>
					<div className='space-y-0.5'>
						<Label
							htmlFor='isActive'
							className='text-sm font-medium cursor-pointer'
						>
							Активный клиент
						</Label>
						<p className='text-xs text-muted-foreground'>
							{isActive
								? 'Клиент доступен для записи'
								: 'Клиент временно неактивен'}
						</p>
					</div>
				</div>

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
