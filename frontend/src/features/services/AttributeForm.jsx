import React, { useState, useCallback, memo } from 'react'
import { useForm } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'

const ATTRIBUTE_TYPES = [
	{ value: 'text', label: 'Текст' },
	{ value: 'number', label: 'Число' },
	{ value: 'select', label: 'Список' },
]

export const AttributeForm = memo(({ onAppendAttribute }) => {
	const {
		register,
		handleSubmit: handleNewAttributeSubmit,
		formState: { errors: newAttributeErrors },
		setValue,
		watch,
		reset,
		trigger,
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

	const newAttributeType = watch('type')
	const newAttributeValues = watch('values')
	const [newAttributeValueInput, setNewAttributeValueInput] = useState('')

	const handleAddAttributeValue = useCallback(() => {
		if (!newAttributeValueInput.trim()) return

		const currentValues = watch('values') || []
		setValue('values', [...currentValues, newAttributeValueInput.trim()])
		setNewAttributeValueInput('')
	}, [newAttributeValueInput, setValue, watch])

	const handleRemoveAttributeValue = useCallback(
		index => {
			const currentValues = watch('values') || []
			setValue(
				'values',
				currentValues.filter((_, i) => i !== index)
			)
		},
		[setValue, watch]
	)

	const handleAddAttribute = useCallback(async () => {
		// Проверяем валидность формы
		const isValid = await trigger(['name', 'type'])

		if (!isValid) {
			return
		}

		const attributeData = watch()

		// Дополнительная проверка для select типа
		if (
			attributeData.type === 'select' &&
			(!attributeData.values || attributeData.values.length === 0)
		) {
			alert('Для типа "Список" необходимо добавить хотя бы одно значение')
			return
		}

		const newAttribute = {
			...attributeData,
			id: Date.now().toString(),
			values: attributeData.values || [],
		}


		onAppendAttribute(newAttribute)

		// Сбрасываем форму
		reset({
			name: '',
			description: '',
			type: '',
			is_required: false,
			values: [],
		})
		setNewAttributeValueInput('')
	}, [watch, onAppendAttribute, reset, trigger])

	const handleKeyPress = useCallback(
		e => {
			if (e.key === 'Enter') {
				e.preventDefault()
				if (newAttributeType === 'select') {
					handleAddAttributeValue()
				} else {
					handleAddAttribute()
				}
			}
		},
		[newAttributeType, handleAddAttributeValue, handleAddAttribute]
	)

	return (
		<div className='space-y-4 p-4 border rounded-lg'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
				<div className='space-y-2'>
					<Label className='text-sm'>Название *</Label>
					<Input
						{...register('name', {
							required: 'Обязательное поле',
						})}
						placeholder='Атрибут'
						className='h-9'
						onKeyPress={handleKeyPress}
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
						value={watch('type')}
						onValueChange={value => setValue('type', value)}
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
					{...register('description')}
					placeholder='Описание атрибута'
					rows={2}
					className='h-16'
					onKeyPress={handleKeyPress}
				/>
			</div>

			{/* Используем display: none вместо условного рендеринга */}
			<div
				style={{ display: newAttributeType === 'select' ? 'block' : 'none' }}
			>
				<div className='space-y-2'>
					<Label className='text-sm'>Значения *</Label>
					<div className='flex gap-2'>
						<Input
							value={newAttributeValueInput}
							onChange={e => setNewAttributeValueInput(e.target.value)}
							placeholder='Новое значение'
							onKeyPress={e => e.key === 'Enter' && handleAddAttributeValue()}
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
					{newAttributeType === 'select' &&
						(!newAttributeValues || newAttributeValues.length === 0) && (
							<p className='text-sm text-destructive'>
								Добавьте хотя бы одно значение для списка
							</p>
						)}
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<Switch
					id='isRequired'
					checked={watch('is_required')}
					onCheckedChange={checked => setValue('is_required', checked)}
				/>
				<Label htmlFor='isRequired' className='text-sm'>
					Обязательный
				</Label>
			</div>
		</div>
	)
})

AttributeForm.displayName = 'AttributeForm'
