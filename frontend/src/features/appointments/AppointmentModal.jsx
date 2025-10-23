import { useEffect, useState, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { Trash2 } from 'lucide-react'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import { DateTimePicker } from '@/shared/ui/DateTimePicker'

export function AppointmentModal({
	isOpen,
	onClose,
	appointment,
	customers,
	masters,
	services,
	onEdit,
	onDelete,
	handleCreate,
}) {
	const [selectedService, setSelectedService] = useState(null)
	const [serviceAttributes, setServiceAttributes] = useState([])

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			customer_uuid: '',
			master_uuid: '',
			service_uuid: '',
			date_time: '',
			duration: 0,
			price: 0,
			note: '',
			attributes: [],
		},
	})

	const { fields, replace } = useFieldArray({
		control,
		name: 'attributes',
	})

	// Следим за изменением выбранной услуги
	const watchServiceUuid = watch('service_uuid')

	// Обработчик изменения услуги
	useEffect(() => {
		if (watchServiceUuid) {
			const service = services?.find(s => s.uuid === watchServiceUuid)
			setSelectedService(service)
			const attributes = service?.category?.attributes || []
			setServiceAttributes(attributes)

			// Создаем начальную структуру для атрибутов
			const initialAttributes = attributes.map(attribute => ({
				attribute_uuid: attribute.uuid,
				value: attribute.type === 'boolean' ? 'false' : '',
				option_uuid: '',
			}))

			replace(initialAttributes)

			// Устанавливаем базовую цену если она есть
			if (service?.base_price) {
				setValue('price', parseFloat(service.base_price))
			}
		} else {
			setSelectedService(null)
			setServiceAttributes([])
			replace([])
		}
	}, [watchServiceUuid, services, setValue, replace])

	// Инициализация формы
	useEffect(() => {
		if (isOpen) {
			if (appointment) {
				const service = services?.find(s => s.uuid === appointment.service_uuid)
				setSelectedService(service)
				setServiceAttributes(service?.category?.attributes || [])

				reset({
					customer_uuid: appointment.customer_uuid,
					master_uuid: appointment.master_uuid,
					service_uuid: appointment.service_uuid,
					date_time: appointment.date_time,
					duration: appointment.duration,
					price: appointment.price,
					note: appointment.note || '',
					attributes: appointment.attributes || [],
				})
			} else {
				setSelectedService(null)
				setServiceAttributes([])
				reset({
					customer_uuid: '',
					master_uuid: '',
					service_uuid: '',
					date_time: '',
					duration: 0,
					price: 0,
					note: '',
					attributes: [],
				})
			}
		}
	}, [appointment, isOpen, reset, services])

	const onSubmit = data => {
		console.log('Submitted data:', data)

		// Фильтруем пустые атрибуты (кроме обязательных)
		const filteredAttributes = data.attributes
			.map(attr => {
				const attributeConfig = serviceAttributes.find(
					a => a.uuid === attr.attribute_uuid
				)

				// Для select используем option_uuid, для остальных - value
				if (attributeConfig?.type === 'select') {
					return {
						attribute_uuid: attr.attribute_uuid,
						option_uuid: attr.option_uuid || '',
					}
				} else {
					return {
						attribute_uuid: attr.attribute_uuid,
						value: attr.value || '',
					}
				}
			})
			.filter(attr => {
				const attributeConfig = serviceAttributes.find(
					a => a.uuid === attr.attribute_uuid
				)
				// Если атрибут обязательный, оставляем его даже если пустой
				if (attributeConfig?.is_required) return true
				// Для необязательных атрибутов оставляем только заполненные
				if (attributeConfig?.type === 'select') {
					return attr.option_uuid !== ''
				} else {
					return attr.value !== ''
				}
			})

		const submitData = {
			...data,
			attributes: filteredAttributes,
		}

		if (appointment) {
			onEdit(appointment, submitData)
		} else {
			handleCreate(submitData)
		}
	}

	const handleDelete = () => {
		if (appointment && onDelete) {
			onDelete(appointment)
		}
	}

	const renderAttributeField = (attribute, index) => {
		const commonProps = {
			title: attribute.name + (attribute.is_required ? ' *' : ''),
			control: control,
		}

		switch (attribute.type) {
			case 'text':
				return (
					<FormInput
						{...commonProps}
						placeholder={`Введите ${attribute.name.toLowerCase()}`}
						type='text'
						name={`attributes.${index}.value`}
						error={errors.attributes?.[index]?.value?.message}
					/>
				)

			case 'number':
				return (
					<FormInput
						{...commonProps}
						placeholder={`Введите ${attribute.name.toLowerCase()}`}
						type='number'
						name={`attributes.${index}.value`}
						error={errors.attributes?.[index]?.value?.message}
					/>
				)

			case 'boolean':
				return (
					<div className='flex items-center space-x-2'>
						<label className='text-sm font-medium'>{attribute.name}</label>
						<input
							type='checkbox'
							{...control.register(`attributes.${index}.value`)}
							defaultValue='false'
							onChange={e => {
								setValue(
									`attributes.${index}.value`,
									e.target.checked ? 'true' : 'false'
								)
							}}
							className='h-4 w-4 rounded border-gray-300'
						/>
					</div>
				)

			case 'select':
				const options =
					attribute.attribute_options?.map(option => ({
						value: option.uuid,
						label: option.value,
					})) || []

				return (
					<FormSelect
						{...commonProps}
						items={options}
						placeholder={`Выберите ${attribute.name.toLowerCase()}`}
						name={`attributes.${index}.option_uuid`}
						error={errors.attributes?.[index]?.option_uuid?.message}
					/>
				)

			default:
				return (
					<FormInput
						{...commonProps}
						placeholder={`Введите ${attribute.name.toLowerCase()}`}
						type='text'
						name={`attributes.${index}.value`}
						error={errors.attributes?.[index]?.value?.message}
					/>
				)
		}
	}

	const title = appointment ? 'Редактировать запись' : 'Новая запись'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='space-y-4'>
					<FormSelect
						items={customers || []}
						title='Клиент *'
						placeholder={'Выберите клиента'}
						name='customer_uuid'
						control={control}
						error={errors.customer_uuid?.message}
					/>
					<FormSelect
						items={
							masters || [
								{
									value: '2d07e0ef-65d8-446a-b371-d97157712ec3',
									label: 'Андрей',
								},
							]
						}
						title='Мастер *'
						placeholder={'Выберите мастера'}
						name='master_uuid'
						control={control}
						error={errors.master_uuid?.message}
					/>
					<FormSelect
						items={services || []}
						title='Услуга *'
						placeholder={'Выберите услугу'}
						name='service_uuid'
						control={control}
						error={errors.service_uuid?.message}
					/>

					{serviceAttributes.length > 0 && (
						<div className='space-y-4 p-4 border rounded-lg'>
							{serviceAttributes.map((attribute, index) => (
								<div key={attribute.uuid}>
									{/* Скрытые поля для attribute_uuid */}
									<input
										type='hidden'
										{...control.register(`attributes.${index}.attribute_uuid`)}
										value={attribute.uuid}
									/>
									{renderAttributeField(attribute, index)}
								</div>
							))}
						</div>
					)}

					<DateTimePicker control={control} name='date_time' />
					<FormInput
						title='Длительность (минуты)'
						placeholder='Введите длительность услуги'
						type='number'
						step = {30}
						name={'duration'}
						control={control}
						error={errors.duration?.message}
					/>

					<FormInput
						title='Цена *'
						type='number'
						name={'price'}
						control={control}
						step = {50}
						className='h-11'
						error={errors.price?.message}
					/>

					<FormInput
						title='Примечание'
						placeholder='Дополнительная информация...'
						type='textarea'
						name={'note'}
						control={control}
						rows={3}
						className='resize-none min-h-[80px]'
						error={errors.note?.message}
					/>
				</div>
				<div className='flex items-center justify-end space-x-3 pt-6'>
					{appointment && (
						<Button
							type='button'
							variant='destructive'
							onClick={handleDelete}
							className='flex items-center gap-2 mr-auto'
							size='sm'
						>
							<Trash2 className='h-4 w-4' />
							Удалить
						</Button>
					)}
					<Button
						type='button'
						variant='outline'
						onClick={onClose}
						size='sm'
						className='px-6'
					>
						Отмена
					</Button>
					<Button type='submit' size='sm' className='px-6'>
						{appointment ? 'Сохранить' : 'Создать'}
					</Button>
				</div>
			</Form>
		</DialogWrapper>
	)
}
