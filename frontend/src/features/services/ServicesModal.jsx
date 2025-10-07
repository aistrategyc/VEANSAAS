import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Form } from '@/shared/ui/form/Form'
import { Trash2 } from 'lucide-react'

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
		register,
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
			category_uuid: '',
		},
	})

	// Следим за состоянием формы
	const is_active = watch('is_active')
	const category_uuid = watch('category_uuid')

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

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
				<DialogHeader className='pb-2'>
					<DialogTitle className='text-xl font-semibold'>
						{service ? 'Редактировать услугу' : 'Новая услуга'}
					</DialogTitle>
				</DialogHeader>

				<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					{/* Basic Information */}
					<div className='space-y-4'>
						<div className='space-y-3'>
							<Label htmlFor='name' className='text-sm font-medium'>
								Название услуги *
							</Label>
							<Input
								id='name'
								{...register('name', {
									required: 'Название услуги обязательно',
								})}
								placeholder='Введите название услуги'
								className={`h-11 ${
									errors.name
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								}`}
							/>
							{errors.name && (
								<p className='text-sm text-destructive mt-1'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className='space-y-3'>
							<Label htmlFor='category_uuid' className='text-sm font-medium'>
								Категория *
							</Label>
							<Select
								value={category_uuid}
								onValueChange={value => setValue('category_uuid', value)}
							>
								<SelectTrigger
									className={`h-11 ${
										errors.category_uuid
											? 'border-destructive focus:ring-destructive'
											: ''
									}`}
								>
									<SelectValue placeholder='Выберите категорию' />
								</SelectTrigger>
								<SelectContent>
									{categories.map(category => (
										<SelectItem
											key={category.uuid}
											value={category.uuid}
											className='py-3'
										>
											<div className='flex items-center space-x-3'>
												{category.color && (
													<div
														className='w-3 h-3 rounded-full flex-shrink-0'
														style={{ backgroundColor: category.color }}
													/>
												)}
												<span className='truncate'>{category.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.category_uuid && (
								<p className='text-sm text-destructive mt-1'>
									{errors.category_uuid.message}
								</p>
							)}
						</div>

						<div className='space-y-3'>
							<Label htmlFor='description' className='text-sm font-medium'>
								Описание
							</Label>
							<Textarea
								id='description'
								{...register('description')}
								placeholder='Описание услуги...'
								rows={3}
								className='resize-none min-h-[80px]'
							/>
						</div>

						<div className='space-y-3'>
							<Label htmlFor='base_price' className='text-sm font-medium'>
								Цена *
							</Label>
							<div className='relative'>
								<Input
									id='base_price'
									type='number'
									{...register('base_price', {
										required: 'Цена обязательна',
										min: {
											value: 0,
											message: 'Цена не может быть отрицательной',
										},
										valueAsNumber: true,
									})}
									min='0'
									step='10'
									className={`h-11 pl-8 ${
										errors.base_price
											? 'border-destructive focus-visible:ring-destructive'
											: ''
									}`}
								/>
								<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm'>
									$
								</span>
							</div>
							{errors.base_price && (
								<p className='text-sm text-destructive mt-1'>
									{errors.base_price.message}
								</p>
							)}
						</div>

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

					{/* Actions */}
					<div className='flex items-center justify-end space-x-3 pt-6 border-t'>
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
			</DialogContent>
		</Dialog>
	)
}
