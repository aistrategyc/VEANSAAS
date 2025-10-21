import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
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
			attributes: [
				{
					attribute_uuid: 'ac96556d-b58c-4e97-8d2a-10242bf4646b',
					value: 'Синий',
				},
			],
		},
	})

	useEffect(() => {
		if (isOpen) {
			if (appointment) {
				reset({
					customer_uuid: appointment.customer_uuid,
					master_uuid: appointment.master_uuid,
					service_uuid: appointment.service_uuid,
					date_time: appointment.date_time,
					duration: appointment.duration,
					price: appointment.price,
					note: appointment.note || '',
					attributes: appointment.attributes || [
						{
							attribute_uuid: 'ac96556d-b58c-4e97-8d2a-10242bf4646b',
							value: 'Синий',
						},
					],
				})
			} else {
				reset({
					customer_uuid: '',
					master_uuid: '',
					service_uuid: '',
					date_time: '',
					duration: 0,
					price: 0,
					note: '',
					attributes: [
						{
							attribute_uuid: 'ac96556d-b58c-4e97-8d2a-10242bf4646b',
							value: 'Синий',
						},
					],
				})
			}
		}
	}, [appointment, isOpen, reset])

	const onSubmit = data => {
		console.log(data)
		if (appointment) {
			onEdit(appointment, data)
		} else {
			handleCreate(data)
		}
	}

	const handleDelete = () => {
		if (appointment && onDelete) {
			onDelete(appointment)
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
						items={customers || [{ value: '3213fd', label: 'Андрей' }]}
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
					<DateTimePicker control={control} name='date_time' />
					<FormInput
						title='Длительность (минуты)'
						placeholder='Введите длительность услуги'
						type='number'
						name={'duration'}
						control={control}
						error={errors.duration?.message}
					/>

					<FormInput
						title='Цена *'
						type='price'
						name={'price'}
						control={control}
						className='h-11 pl-8'
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
