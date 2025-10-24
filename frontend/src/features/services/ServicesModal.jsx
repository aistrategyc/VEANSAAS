import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { Trash2 } from 'lucide-react'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import FormSwitch from '@/shared/ui/switch/FormSwitch'
import { useDispatch } from 'react-redux'
import { fetchCategories } from '@/shared/slices/categoriesSlice'

export function ServiceModal({
	isOpen,
	onClose,
	service,
	categories,
	onSave,
	onEdit,
	onDelete,
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			base_price: 0,
			is_active: true,
			category_uuid: '',
		},
	})
	const dispatch = useDispatch()
	useEffect(() => {
		if (isOpen && categories.length === 0) {
			dispatch(fetchCategories())
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			if (service) {
				reset({
					name: service.name,
					description: service.description || '',
					base_price: service.base_price,
					is_active: service.is_active,
					category_uuid: service.category_uuid,
				})
			} else {
				reset({
					name: '',
					description: '',
					base_price: 0,
					is_active: true,
					category_uuid: '',
				})
			}
		}
	}, [service, isOpen, reset])

	const onSubmit = data => {
		console.log(data)
		if (service) {
			onEdit(service, data)
		} else {
			onSave(data)
		}
	}

	const handleDelete = () => {
		if (service && onDelete) {
			onDelete(service)
		}
	}

	const title = service ? 'Редактировать услугу' : 'Новая услуга'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='space-y-4'>
					<FormInput
						title='Название услуги'
						placeholder='Введите название услуги'
						type='text'
						name={'name'}
						control={control}
						className={errors.name ? 'border-destructive' : ''}
						error={errors.name?.message}
					/>
					<FormSelect
						items={categories}
						title='Категория *'
						placeholder={'Выберите категорию'}
						name='category_uuid'
						control={control}
						error={errors.category_uuid?.message}
					/>
					<FormInput
						title='Описание'
						placeholder='Описание услуги...'
						type='textarea'
						name={'description'}
						control={control}
						rows={3}
						className='resize-none min-h-[80px]'
						error={errors.description?.message}
					/>
					<FormInput
						title='Цена *'
						type='price'
						name={'base_price'}
						control={control}
						className='h-11 pl-8'
						error={errors.base_price?.message}
					/>
					<FormSwitch
						control={control}
						title={'Активная услуга'}
						name={'is_active'}
					/>
				</div>
				<div className='flex items-center justify-end space-x-3 pt-6'>
					{service && (
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
						{service ? 'Сохранить' : 'Создать'}
					</Button>
				</div>
			</Form>
		</DialogWrapper>
	)
}
