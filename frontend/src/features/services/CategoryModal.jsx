import { useCallback, useEffect, useState } from 'react'
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
import { Form } from '@/shared/ui/form/Form'
import { Trash2, Plus, Tag, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AttributeList } from './AttributeList'
import { AttributeForm } from './AttributeForm'

export function CategoryModal({
	isOpen,
	onClose,
	category,
	onSave,
	onEdit,
	onDelete,
}) {
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
		}
	}, [category, isOpen, reset])

	const handleRemoveAttribute = index => {
		removeAttribute(index)
	}
	const handleAppendAttribute = useCallback(
		attribute => {
			appendAttribute(attribute)
		},
		[appendAttribute]
	)

	const onSubmit = data => {
		if (category) {
			onEdit(category, data)
		} else {
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
								checked={watch('is_active')}
								onCheckedChange={checked => setValue('is_active', checked)}
							/>
							<Label htmlFor='isActive' className='text-sm'>
								Активная категория
							</Label>
						</div>
					</div>
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

						<AttributeForm onAppendAttribute={handleAppendAttribute} />
						{attributeFields.length > 0 && (
							<AttributeList
								fields={attributeFields}
								onRemove={handleRemoveAttribute}
							/>
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
