'use client'

import { useState, useEffect } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

const PRESET_COLORS = [
	'#0891b2', // cyan-600
	'#f97316', // orange-500
	'#dc2626', // red-600
	'#16a34a', // green-600
	'#9333ea', // purple-600
	'#e11d48', // rose-600
	'#0d9488', // teal-600
	'#ca8a04', // yellow-600
]

export function CategoryModal({ isOpen, onClose, category, onSave }) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		color: '#0891b2',
		isActive: true,
	})

	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (category) {
			setFormData({
				name: category.name,
				description: category.description || '',
				color: category.color,
				isActive: category.isActive,
			})
		} else {
			setFormData({
				name: '',
				description: '',
				color: '#0891b2',
				isActive: true,
			})
		}
		setErrors({})
	}, [category, isOpen])

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

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{category ? 'Редактировать категорию' : 'Новая категория'}
					</DialogTitle>
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

					{/* Name */}
					<div className='space-y-2'>
						<Label htmlFor='name'>Название категории *</Label>
						<Input
							id='name'
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
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

					{/* Color */}
					<div className='space-y-2'>
						<Label>Цвет категории *</Label>
						<div className='grid grid-cols-4 gap-2'>
							{PRESET_COLORS.map(color => (
								<div
									key={color}
									className={`w-12 h-12 rounded-md cursor-pointer border-2 transition-all ${
										formData.color === color
											? 'border-foreground scale-110'
											: 'border-border hover:scale-105'
									}`}
									style={{ backgroundColor: color }}
									onClick={() => setFormData({ ...formData, color })}
								/>
							))}
						</div>
						<div className='flex items-center space-x-2'>
							<Input
								type='color'
								value={formData.color}
								onChange={e =>
									setFormData({ ...formData, color: e.target.value })
								}
								className='w-16 h-10 p-1 border rounded'
							/>
							<span className='text-sm text-muted-foreground'>
								Или выберите свой цвет
							</span>
						</div>
						{errors.color && (
							<p className='text-sm text-destructive'>{errors.color}</p>
						)}
					</div>

					{/* Preview */}
					<div className='space-y-2'>
						<Label>Предварительный просмотр</Label>
						<div className='p-3 border rounded-md bg-muted/50'>
							<div className='flex items-center space-x-2'>
								<div
									className='w-4 h-4 rounded-full'
									style={{ backgroundColor: formData.color }}
								/>
								<span className='font-medium'>
									{formData.name || 'Название категории'}
								</span>
							</div>
							{formData.description && (
								<p className='text-sm text-muted-foreground mt-1'>
									{formData.description}
								</p>
							)}
						</div>
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
	)
}
