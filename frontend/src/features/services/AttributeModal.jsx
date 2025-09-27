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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ATTRIBUTE_TYPES = [
	{ value: 'text', label: 'Текст' },
	{ value: 'number', label: 'Число' },
	{ value: 'select', label: 'Выбор из списка' },
]

export function AttributeModal({ isOpen, onClose, attribute, onSave }) {
	const [formData, setFormData] = useState({
		name: '',
		type: 'text',
		isRequired: false,
		values: [], // Для типа select
	})

	const [newValue, setNewValue] = useState('')
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (attribute) {
			setFormData({
				name: attribute.name,
				type: attribute.type,
				isRequired: attribute.isRequired || false,
				values: attribute.values || [],
			})
		} else {
			setFormData({
				name: '',
				type: 'text',
				isRequired: false,
				values: [],
			})
		}
		setNewValue('')
		setErrors({})
	}, [attribute, isOpen])

	const validateForm = () => {
		const newErrors = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Название атрибута обязательно'
		}

		if (formData.type === 'select' && formData.values.length === 0) {
			newErrors.values = 'Добавьте хотя бы одно значение для списка'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddValue = () => {
		if (!newValue.trim()) return

		setFormData(prev => ({
			...prev,
			values: [...prev.values, newValue.trim()],
		}))
		setNewValue('')
	}

	const handleRemoveValue = index => {
		setFormData(prev => ({
			...prev,
			values: prev.values.filter((_, i) => i !== index),
		}))
	}

	const handleSave = () => {
		if (!validateForm()) return

		const attributeData = {
			...formData,
			id: attribute?.id || Date.now().toString(),
		}

		onSave(attributeData)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{attribute ? 'Редактировать атрибут' : 'Новый атрибут'}
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
						<Label htmlFor='name'>Название атрибута *</Label>
						<Input
							id='name'
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
							placeholder='Например: Размер, Цвет, Материал'
							className={errors.name ? 'border-destructive' : ''}
						/>
					</div>

					{/* Type */}
					<div className='space-y-2'>
						<Label htmlFor='type'>Тип атрибута *</Label>
						<Select
							value={formData.type}
							onValueChange={value => setFormData({ ...formData, type: value })}
						>
							<SelectTrigger>
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
					</div>

					{/* Values for select type */}
					{formData.type === 'select' && (
						<div className='space-y-2'>
							<Label>Значения списка *</Label>
							<div className='space-y-2'>
								<div className='flex space-x-2'>
									<Input
										value={newValue}
										onChange={e => setNewValue(e.target.value)}
										placeholder='Добавить значение'
										onKeyPress={e => e.key === 'Enter' && handleAddValue()}
									/>
									<Button type='button' onClick={handleAddValue}>
										<Plus className='h-4 w-4' />
									</Button>
								</div>
								{errors.values && (
									<p className='text-sm text-destructive'>{errors.values}</p>
								)}
							</div>

							{formData.values.length > 0 && (
								<div className='space-y-2'>
									<Label>Добавленные значения:</Label>
									<div className='flex flex-wrap gap-2'>
										{formData.values.map((value, index) => (
											<Badge
												key={index}
												variant='secondary'
												className='flex items-center space-x-1'
											>
												<span>{value}</span>
												<button
													type='button'
													onClick={() => handleRemoveValue(index)}
													className='hover:text-destructive'
												>
													<Trash2 className='h-3 w-3' />
												</button>
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Required */}
					<div className='flex items-center space-x-2'>
						<Switch
							id='isRequired'
							checked={formData.isRequired}
							onCheckedChange={checked =>
								setFormData({ ...formData, isRequired: checked })
							}
						/>
						<Label htmlFor='isRequired'>Обязательный атрибут</Label>
					</div>

					{/* Preview */}
					<div className='space-y-2'>
						<Label>Предварительный просмотр</Label>
						<div className='p-3 border rounded-md bg-muted/50'>
							<div className='text-sm font-medium'>{formData.name}</div>
							<div className='text-sm text-muted-foreground'>
								Тип:{' '}
								{ATTRIBUTE_TYPES.find(t => t.value === formData.type)?.label}
							</div>
							{formData.type === 'select' && formData.values.length > 0 && (
								<div className='text-sm text-muted-foreground mt-1'>
									Значения: {formData.values.join(', ')}
								</div>
							)}
							{formData.isRequired && (
								<Badge variant='outline' className='mt-1 text-xs'>
									Обязательный
								</Badge>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end space-x-2 pt-4'>
						<Button variant='outline' onClick={onClose}>
							Отмена
						</Button>
						<Button onClick={handleSave}>
							{attribute ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
