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
import { FormInput } from '@/shared/ui/input/FormInput'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import FormSwitch from '@/shared/ui/switch/FormSwitch'

export const CategoryModal = ({
	isOpen,
	onClose,
	category,
	onSave,
	onEdit,
	onDelete,
}) => {
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

	const title = category ? 'Редактировать категорию' : 'Новая категория'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='space-y-4'>
					<FormInput
						title='Название *'
						placeholder='Название категории'
						type='text'
						name={'name'}
						control={control}
						className={errors.name ? 'border-destructive' : ''}
						error={errors.name?.message}
					/>
					<FormInput
						title='Описание'
						placeholder='Описание категории...'
						type='textarea'
						name={'description'}
						control={control}
						rows={2}
						className='resize-none min-h-[80px]'
						error={errors.description?.message}
					/>

					<FormSwitch
						name='is_active'
						control={control}
						title='Активная категории'
					/>
				</div>
				<div className='space-y-4 mt-3'>
					<div className='flex items-center gap-2'>
						<Label className='text-base'>Атрибуты</Label>
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
						<Button type='button' variant='outline' onClick={onClose} size='sm'>
							Отмена
						</Button>
						<Button type='submit' size='sm'>
							{category ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</Form>
		</DialogWrapper>
	)
}
