import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Form } from '@/shared/ui/form/Form'
import { Trash2, Plus, Tag, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ATTRIBUTE_TYPES = [
	{ value: 'text', label: 'Текст' },
	{ value: 'number', label: 'Число' },
	{ value: 'select', label: 'Список' },
]

export function CategoryModal({
	isOpen,
	onClose,
	category,
	onSave,
	onEdit,
	onDelete,
}) {
	// Основная форма для категории с атрибутами
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
		control,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			is_active: true,
			attributes: [],
		},
	})

	const {
		fields: attributeFields,
		append: appendAttribute,
		remove: removeAttribute,
	} = useFieldArray({
		control,
		name: 'attributes',
	})

	// Форма для временного хранения нового атрибута
	const {
		register: registerNewAttribute,
		handleSubmit: handleNewAttributeSubmit,
		formState: { errors: newAttributeErrors },
		setValue: setNewAttributeValue,
		watch: watchNewAttribute,
		reset: resetNewAttribute,
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			type: '',
			is_required: false,
			values: [],
		},
	})

	const is_active = watch('is_active')
	const newAttributeType = watchNewAttribute('type')
	const newAttributeValues = watchNewAttribute('values')
	const [newAttributeValueInput, setNewAttributeValueInput] = useState('')

	useEffect(() => {
		if (isOpen) {
			if (category) {
				reset({
					name: category.name,
					description: category.description || '',
					is_active: category.isActive,
					attributes: category.attributes || [],
				})
			} else {
				reset({
					name: '',
					description: '',
					is_active: true,
					attributes: [],
				})
			}
			resetNewAttribute({
				name: '',
				description: '',
				type: '',
				is_required: false,
				values: [],
			})
			setNewAttributeValueInput('')
		}
	}, [category, isOpen, reset, resetNewAttribute])

	const handleAddAttributeValue = () => {
		if (!newAttributeValueInput.trim()) return

		const currentValues = watchNewAttribute('values') || []
		setNewAttributeValue('values', [
			...currentValues,
			newAttributeValueInput.trim(),
		])
		setNewAttributeValueInput('')
	}

	const handleRemoveAttributeValue = index => {
		const currentValues = watchNewAttribute('values') || []
		setNewAttributeValue(
			'values',
			currentValues.filter((_, i) => i !== index)
		)
	}

	const handleAddAttribute = () => {
		const attributeData = watchNewAttribute()

		if (!attributeData.name?.trim()) return

		if (
			attributeData.type === 'select' &&
			(!attributeData.values || attributeData.values.length === 0)
		) {
			return
		}

		const newAttribute = {
			...attributeData,
			id: Date.now().toString(),
			values: attributeData.values || [],
		}

		appendAttribute(newAttribute)

		resetNewAttribute({
			name: '',
			description: '',
			type: '',
			is_required: false,
			values: [],
		})
		setNewAttributeValueInput('')
	}

	const handleRemoveAttribute = index => {
		removeAttribute(index)
	}

	const onSubmit = data => {
		console.log('Отправляемые данные:', data)

		if (category) {
			// Редактирование существующей категории
			onEdit(category, data)
		} else {
			// Создание новой категории - отправляем полную модель данных
			onSave({
				name: data.name,
				description: data.description,
				is_active: data.is_active,
				attributes: data.attributes || [],
			})
		}
	}

	const handleDelete = () => {
		if (category && onDelete) {
			onDelete(category)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader className='pb-4'>
					<DialogTitle className='flex items-center gap-2 text-lg'>
						<Tag className='h-5 w-5' />
						{category ? 'Редактировать категорию' : 'Новая категория'}
					</DialogTitle>
				</DialogHeader>

				<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Название *</Label>
							<Input
								id='name'
								{...register('name', {
									required: 'Обязательное поле',
								})}
								placeholder='Название категории'
								className={errors.name ? 'border-destructive' : ''}
							/>
							{errors.name && (
								<p className='text-sm text-destructive'>
									{errors.name.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>Описание</Label>
							<Textarea
								id='description'
								{...register('description')}
								placeholder='Описание категории'
								rows={2}
							/>
						</div>

						<div className='flex items-center gap-3 p-3 border rounded-lg'>
							<Switch
								id='isActive'
								checked={is_active}
								onCheckedChange={checked => setValue('is_active', checked)}
							/>
							<Label htmlFor='isActive' className='text-sm'>
								Активная категория
							</Label>
						</div>
					</div>

					{/* Секция атрибутов - теперь доступна и при создании категории */}
					<div className='space-y-4 mt-3'>
						<div className='flex items-center gap-2'>
							<List className='h-4 w-4' />
							<Label className='text-base'>Атрибуты</Label>
							{attributeFields.length > 0 && (
								<Badge variant='secondary' className='text-xs'>
									{attributeFields.length}
								</Badge>
							)}
						</div>

						{/* Форма добавления атрибута */}
						<div className='space-y-4 p-4 border rounded-lg'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
								<div className='space-y-2'>
									<Label className='text-sm'>Название *</Label>
									<Input
										{...registerNewAttribute('name', {
											required: 'Обязательное поле',
										})}
										placeholder='Атрибут'
										className='h-9'
									/>
									{newAttributeErrors.name && (
										<p className='text-sm text-destructive'>
											{newAttributeErrors.name.message}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label className='text-sm'>Тип *</Label>
									<Select
										value={watchNewAttribute('type')}
										onValueChange={value => setNewAttributeValue('type', value)}
									>
										<SelectTrigger className='h-9'>
											<SelectValue placeholder='Выберите тип' />
										</SelectTrigger>
										<SelectContent>
											{ATTRIBUTE_TYPES.map(type => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{newAttributeErrors.type && (
										<p className='text-sm text-destructive'>
											{newAttributeErrors.type.message}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label className='text-sm opacity-0'>Добавить</Label>
									<Button
										type='button'
										onClick={handleAddAttribute}
										className='h-9 w-full'
										size='sm'
									>
										<Plus className='h-3 w-3 mr-1' />
										Добавить
									</Button>
								</div>
							</div>

							<div className='space-y-2'>
								<Label className='text-sm'>Описание атрибута</Label>
								<Textarea
									{...registerNewAttribute('description')}
									placeholder='Описание атрибута'
									rows={2}
									className='h-16'
								/>
							</div>

							{newAttributeType === 'select' && (
								<div className='space-y-2'>
									<Label className='text-sm'>Значения *</Label>
									<div className='flex gap-2'>
										<Input
											value={newAttributeValueInput}
											onChange={e => setNewAttributeValueInput(e.target.value)}
											placeholder='Новое значение'
											onKeyPress={e =>
												e.key === 'Enter' && handleAddAttributeValue()
											}
											className='h-8 flex-1'
										/>
										<Button
											type='button'
											onClick={handleAddAttributeValue}
											variant='outline'
											size='sm'
											className='h-8'
										>
											<Plus className='h-3 w-3' />
										</Button>
									</div>

									{newAttributeValues && newAttributeValues.length > 0 && (
										<div className='flex flex-wrap gap-1'>
											{newAttributeValues.map((value, index) => (
												<Badge
													key={index}
													variant='secondary'
													className='text-xs px-2 py-1 flex items-center gap-1'
												>
													{value}
													<button
														type='button'
														onClick={() => handleRemoveAttributeValue(index)}
														className='hover:text-destructive'
													>
														<Trash2 className='h-3 w-3' />
													</button>
												</Badge>
											))}
										</div>
									)}
									{(!newAttributeValues || newAttributeValues.length === 0) && (
										<p className='text-sm text-muted-foreground'>
											Добавьте хотя бы одно значение для списка
										</p>
									)}
								</div>
							)}

							<div className='flex items-center gap-2'>
								<Switch
									id='isRequired'
									checked={watchNewAttribute('is_required')}
									onCheckedChange={checked =>
										setNewAttributeValue('is_required', checked)
									}
								/>
								<Label htmlFor='isRequired' className='text-sm'>
									Обязательный
								</Label>
							</div>
						</div>

						{attributeFields.length > 0 && (
							<div className='space-y-2'>
								<Label className='text-sm'>Добавленные атрибуты:</Label>
								<div className='space-y-2'>
									{attributeFields.map((field, index) => (
										<div
											key={field.id}
											className='flex items-center justify-between p-3 border rounded-lg'
										>
											<div className='flex items-center gap-3 flex-1 min-w-0'>
												<div className='flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<span className='font-medium text-sm truncate'>
															{field.name}
														</span>
														<Badge variant='outline' className='text-xs'>
															{
																ATTRIBUTE_TYPES.find(
																	t => t.value === field.type
																)?.label
															}
														</Badge>
														{field.is_required && (
															<Badge variant='destructive' className='text-xs'>
																Обязательный
															</Badge>
														)}
													</div>
													{field.description && (
														<p className='text-xs text-muted-foreground truncate'>
															{field.description}
														</p>
													)}
													{field.type === 'select' &&
														field.values &&
														field.values.length > 0 && (
															<p className='text-xs text-muted-foreground truncate'>
																Значения: {field.values.join(', ')}
															</p>
														)}
												</div>
											</div>
											<Button
												type='button'
												variant='ghost'
												size='sm'
												onClick={() => handleRemoveAttribute(index)}
												className='shrink-0 ml-2'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className='flex items-center justify-between pt-4'>
						{category && (
							<Button
								type='button'
								variant='destructive'
								onClick={handleDelete}
								size='sm'
							>
								<Trash2 className='h-4 w-4 mr-1' />
								Удалить
							</Button>
						)}
						<div className='flex items-center gap-2 ml-auto'>
							<Button
								type='button'
								variant='outline'
								onClick={onClose}
								size='sm'
							>
								Отмена
							</Button>
							<Button type='submit' size='sm'>
								{category ? 'Сохранить' : 'Создать'}
							</Button>
						</div>
					</div>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
