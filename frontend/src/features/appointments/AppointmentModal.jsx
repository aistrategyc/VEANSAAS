import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { Trash2 } from 'lucide-react'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import { DateTimePicker } from '@/shared/ui/DateTimePicker'

import { FormServiceAttributes } from './FormServiceAttributes'
import { createAppointmentSchema } from './utils/validationSchemas'
import FormScrollSelect from './FormScrollSelect'
import { formatAttributes } from './utils/formatAttributes'
import { useAppointment } from './hooks/useAppointment'

export function AppointmentModal({
	isOpen,
	onClose,
	appointment,
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
		formState: { errors, isValid },
		reset,
		watch,
		setValue,
		trigger,
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(createAppointmentSchema(serviceAttributes)),
		defaultValues: {
			customer_uuid: '',
			master_uuid: '',
			service: '',
			date_time: '',
			duration: 0,
			price: 0,
			note: '',
			attributes: [],
		},
	})

	const watchService = watch('service')

	const { servicesSelectionList, getServicesSelectionList } = useAppointment()

	useEffect(() => {
		if (isOpen) {
			getServicesSelectionList()
		}
	}, [isOpen])

	useEffect(() => {
		if (watchService) {
			setSelectedService(watchService)
			setServiceAttributes(watchService.category?.attributes || [])
			if (watchService.base_price) {
				setValue('price', parseFloat(watchService.base_price))
			}
		} else {
			setSelectedService(null)
			setServiceAttributes([])
		}
	}, [watchService])

	useEffect(() => {
		if (isOpen) {
			if (appointment) {
				const service = services?.find(s => s.uuid === appointment.service_uuid)
				setSelectedService(service)
				setServiceAttributes(service?.category?.attributes || [])

				reset({
					customer_uuid: appointment.customer_uuid,
					master_uuid: appointment.master_uuid,
					service: appointment.service_uuid,
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
					service: '',
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
		trigger()

		const formattedAttributes = formatAttributes(
			data,
			services,
			selectedService,
			data.service.uuid
		)
		const submitData = {
			...data,
			service_uuid: data.service?.uuid,
			attributes: formattedAttributes,
		}

		if (appointment) {
			onEdit(appointment, submitData)
		} else {
			handleCreate(submitData)
		}

		onClose()
	}

	const handleDelete = () => {
		if (appointment && onDelete) {
			onDelete(appointment)
			onClose()
		}
	}

	const title = appointment ? 'Редактировать запись' : 'Новая запись'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='space-y-4'>
					<FormScrollSelect
						name='customer_uuid'
						control={control}
						title='Клиент *'
						placeholder='Выберите клиента'
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
						placeholder='Выберите мастера'
						name='master_uuid'
						control={control}
						error={errors.master_uuid?.message}
					/>

					<FormSelect
						items={servicesSelectionList || []}
						title='Услуга *'
						placeholder='Выберите услугу'
						name='service'
						control={control}
						returnObject
						error={errors.service?.message}
					/>

					<FormServiceAttributes
						service={selectedService}
						services={servicesSelectionList}
						control={control}
						errors={errors}
						setValue={setValue}
						watch={watch}
					/>

					<DateTimePicker
						control={control}
						name='date_time'
						error={errors.date_time?.message}
					/>

					<FormInput
						title='Длительность (минуты) *'
						placeholder='Введите длительность услуги'
						type='number'
						step={30}
						name='duration'
						control={control}
						error={errors.duration?.message}
					/>

					<FormInput
						title='Цена *'
						type='number'
						name='price'
						control={control}
						step={50}
						className='h-11'
						error={errors.price?.message}
					/>

					<FormInput
						title='Примечание'
						placeholder='Дополнительная информация...'
						type='textarea'
						name='note'
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
					<Button type='submit' size='sm' className='px-6' disabled={!isValid}>
						{appointment ? 'Сохранить' : 'Создать'}
					</Button>
				</div>
			</Form>
		</DialogWrapper>
	)
}
