import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Form } from '@/shared/ui/form/Form'
import { Trash2 } from 'lucide-react'
import { FormInput } from '@/shared/ui/input/FormInput'
import { SelectForm } from '@/shared/ui/select/Select'
import { CATEGORY_TYPES } from './lib/constants'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'

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
		setValue,
		watch,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			base_price: 0,
			is_active: true,
			category_uuid: '0b12b41e-ee3b-4da3-82c9-f77851f2194b',
		},
	})

	const is_active = watch('is_active')
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
					<SelectForm
						items={CATEGORY_TYPES}
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

					<div className='flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border'>
						<Switch
							id='is_active'
							checked={is_active}
							onCheckedChange={checked => setValue('is_active', checked)}
						/>
						<div className='space-y-0.5'>
							<Label
								htmlFor='is_active'
								className='text-sm font-medium cursor-pointer'
							>
								Активная услуга
							</Label>
							<p className='text-xs text-muted-foreground'>
								{is_active
									? 'Услуга доступна для записи'
									: 'Услуга временно недоступна'}
							</p>
						</div>
					</div>
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
