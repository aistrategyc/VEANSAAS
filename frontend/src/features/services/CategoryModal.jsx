// components/categories/CategoryModal.jsx
'use client'

import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Plus, Settings, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AttributeModal } from './AttributeModal'

const PRESET_COLORS = [
	'#0891b2',
	'#f97316',
	'#dc2626',
	'#16a34a',
	'#9333ea',
	'#e11d48',
	'#0d9488',
	'#ca8a04',
]

export function CategoryModal({
	isOpen,
	onClose,
	category,
	onSave,
	attributes = [],
	onSaveAttribute, // Добавляем этот prop
}) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		color: '#0891b2',
		isActive: true,
		attributeIds: [],
	})

	const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false)
	const [editingAttribute, setEditingAttribute] = useState(null)
	const [errors, setErrors] = useState({})

	// ФИКС: Убираем все проблемные useEffect и используем attributes напрямую
	useEffect(() => {
		if (isOpen) {
			if (category) {
				setFormData({
					name: category.name,
					description: category.description || '',
					color: category.color,
					isActive: category.isActive,
					attributeIds: category.attributeIds || [],
				})
			} else {
				setFormData({
					name: '',
					description: '',
					color: '#0891b2',
					isActive: true,
					attributeIds: [],
				})
			}
			setErrors({})
		}
	}, [category, isOpen]) // Только эти зависимости

	const validateForm = () => {
		const newErrors = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Название категории обязательно'
		}
		if (!formData.color) {
			newErrors.color = 'Выберите цвет категории'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = () => {
		if (!validateForm()) return

		const categoryData = {
			...formData,
			description: formData.description || undefined,
		}

		onSave(categoryData)
	}

	const handleAttributeSave = attributeData => {
		// Делегируем сохранение родительскому компоненту
		if (onSaveAttribute) {
			onSaveAttribute(attributeData)
		}
		setIsAttributeModalOpen(false)
		setEditingAttribute(null)
	}

	const handleAddAttribute = attribute => {
		if (!formData.attributeIds.includes(attribute.id)) {
			setFormData(prev => ({
				...prev,
				attributeIds: [...prev.attributeIds, attribute.id],
			}))
		}
	}

	const handleRemoveAttribute = attributeId => {
		setFormData(prev => ({
			...prev,
			attributeIds: prev.attributeIds.filter(id => id !== attributeId),
		}))
	}

	const getAttributeById = id => {
		return attributes.find(attr => attr.id === id) // Используем attributes напрямую
	}

	const getAttributeTypeLabel = type => {
		const types = {
			text: 'Текст',
			number: 'Число',
			select: 'Список',
		}
		return types[type] || type
	}
	const attributesNew = [
		{
			name: 'Окрас',
			type: 'text',
			isRequired: false,
			values: [], // Для типа select
		},
	]

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					{/* ФИКС: Добавляем DialogDescription для accessibility */}
					<DialogHeader>
						<DialogTitle>
							{category ? 'Редактировать категорию' : 'Новая категория'}
						</DialogTitle>
						<DialogDescription>
							{category
								? 'Внесите изменения в категорию'
								: 'Добавьте новую категорию'}
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-6'>
						{Object.keys(errors).length > 0 && (
							<Alert variant='destructive'>
								<AlertTriangle className='h-4 w-4' />
								<AlertDescription>
									<ul className='list-disc list-inside space-y-1'>
										{Object.values(errors).map((error, index) => (
											<li key={index}>{error}</li>
										))}
									</ul>
								</AlertDescription>
							</Alert>
						)}

						{/* Basic Information */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* Name */}
							<div className='space-y-2'>
								<Label htmlFor='name'>Название категории *</Label>
								<Input
									id='name'
									value={formData.name}
									onChange={e =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder='Введите название категории'
									className={errors.name ? 'border-destructive' : ''}
								/>
							</div>

							{/* Description */}
							<div className='space-y-2'>
								<Label htmlFor='description'>Описание</Label>
								<Textarea
									id='description'
									value={formData.description}
									onChange={e =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder='Описание категории...'
									rows={3}
								/>
							</div>

							{/* Status */}
							<div className='flex items-center space-x-2'>
								<Switch
									id='isActive'
									checked={formData.isActive}
									onCheckedChange={checked =>
										setFormData({ ...formData, isActive: checked })
									}
								/>
								<Label htmlFor='isActive'>Активная категория</Label>
							</div>

							{/* Color */}
						</div>

						{/* Attributes Section */}
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<Label>Атрибуты категории</Label>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => setIsAttributeModalOpen(true)}
								>
									<Plus className='h-4 w-4 mr-2' />
									Создать атрибут
								</Button>
							</div>

							{/* Available Attributes */}
							<div className='space-y-3'>
								<Label className='text-sm text-muted-foreground'>
									Доступные атрибуты:
								</Label>
								{attributesNew.length === 0 ? ( // ФИКС: используем attributes напрямую
									<p className='text-sm text-muted-foreground italic'>
										Атрибуты не созданы. Нажмите "Создать атрибут" чтобы
										добавить первый.
									</p>
								) : (
									<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
										{attributesNew.map(attribute => {
											// ФИКС: используем attributes напрямую
											const isSelected = formData.attributeIds.includes(
												attribute.id
											)
											return (
												<div
													key={attribute.id}
													className={`p-3 border rounded-md cursor-pointer transition-all ${
														isSelected
															? 'bg-primary/10 border-primary'
															: 'hover:bg-muted/50'
													}`}
													onClick={() =>
														isSelected
															? handleRemoveAttribute(attribute.id)
															: handleAddAttribute(attribute)
													}
												>
													<div className='flex items-center justify-between'>
														<div>
															<div className='font-medium'>
																{attribute.name}
															</div>
															<div className='text-sm text-muted-foreground'>
																{getAttributeTypeLabel(attribute.type)}
																{attribute.isRequired && (
																	<Badge
																		variant='outline'
																		className='ml-2 text-xs'
																	>
																		Обязательный
																	</Badge>
																)}
															</div>
														</div>
														<Button
															type='button'
															variant='ghost'
															size='sm'
															onClick={e => {
																e.stopPropagation()
																setEditingAttribute(attribute)
																setIsAttributeModalOpen(true)
															}}
														>
															<Settings className='h-4 w-4' />
														</Button>
													</div>
													{attribute.type === 'select' && attribute.values && (
														<div className='text-xs text-muted-foreground mt-1'>
															Значения: {attribute.values.join(', ')}
														</div>
													)}
												</div>
											)
										})}
									</div>
								)}
							</div>
						</div>

						{/* Actions */}
						<div className='flex items-center justify-end space-x-2 pt-4'>
							<Button variant='outline' onClick={onClose}>
								Отмена
							</Button>
							<Button onClick={handleSave}>Сохранить</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<AttributeModal
				isOpen={isAttributeModalOpen}
				onClose={() => {
					setIsAttributeModalOpen(false)
					setEditingAttribute(null)
				}}
				attribute={editingAttribute}
				onSave={handleAttributeSave}
			/>
		</>
	)
}
