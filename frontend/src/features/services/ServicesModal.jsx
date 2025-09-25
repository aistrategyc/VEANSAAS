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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

const QUALIFICATION_OPTIONS = [
	'HAIR_STYLING',
	'COLORING',
	'MANICURE',
	'PEDICURE',
	'MASSAGE',
	'FACIAL',
	'WAXING',
	'EYEBROW',
	'EYELASH',
]

const SPACE_TYPE_OPTIONS = ['CHAIR', 'ROOM', 'STATION']

export function ServiceModal({ isOpen, onClose, service, categories, onSave }) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		categoryId: '',
		duration: 60,
		price: 0,
		currency: 'USD',
		requiredQualifications: [],
		compatibleSpaceTypes: [],
		bufferTime: 15,
		isActive: true,
	})

	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (service) {
			setFormData({
				name: service.name,
				description: service.description || '',
				categoryId: service.categoryId,
				duration: service.duration,
				price: service.price,
				currency: service.currency,
				requiredQualifications: service.requiredQualifications,
				compatibleSpaceTypes: service.compatibleSpaceTypes,
				bufferTime: service.bufferTime || 15,
				isActive: service.isActive,
			})
		} else {
			setFormData({
				name: '',
				description: '',
				categoryId: '',
				duration: 60,
				price: 0,
				currency: 'RUB',
				requiredQualifications: [],
				compatibleSpaceTypes: [],
				bufferTime: 15,
				isActive: true,
			})
		}
		setErrors({})
	}, [service, isOpen])

	const validateForm = () => {
		const newErrors = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Название услуги обязательно'
		}
		if (!formData.categoryId) {
			newErrors.categoryId = 'Выберите категорию'
		}
		if (formData.duration <= 0) {
			newErrors.duration = 'Длительность должна быть больше 0'
		}
		if (formData.price < 0) {
			newErrors.price = 'Цена не может быть отрицательной'
		}
		if (formData.requiredQualifications.length === 0) {
			newErrors.requiredQualifications = 'Выберите хотя бы одну квалификацию'
		}
		if (formData.compatibleSpaceTypes.length === 0) {
			newErrors.compatibleSpaceTypes = 'Выберите хотя бы один тип места'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = () => {
		if (!validateForm()) return

		const serviceData = {
			...formData,
			description: formData.description || undefined,
		}

		onSave(serviceData)
	}

	const toggleQualification = qualification => {
		setFormData(prev => ({
			...prev,
			requiredQualifications: prev.requiredQualifications.includes(
				qualification
			)
				? prev.requiredQualifications.filter(q => q !== qualification)
				: [...prev.requiredQualifications, qualification],
		}))
	}

	const toggleSpaceType = spaceType => {
		setFormData(prev => ({
			...prev,
			compatibleSpaceTypes: prev.compatibleSpaceTypes.includes(spaceType)
				? prev.compatibleSpaceTypes.filter(s => s !== spaceType)
				: [...prev.compatibleSpaceTypes, spaceType],
		}))
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{service ? 'Редактировать услугу' : 'Новая услуга'}
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

					{/* Basic Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Название услуги *</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={e =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder='Введите название услуги'
								className={errors.name ? 'border-destructive' : ''}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='category'>Категория *</Label>
							<Select
								value={formData.categoryId}
								onValueChange={value =>
									setFormData({ ...formData, categoryId: value })
								}
							>
								<SelectTrigger
									className={errors.categoryId ? 'border-destructive' : ''}
								>
									<SelectValue placeholder='Выберите категорию' />
								</SelectTrigger>
								<SelectContent>
									{categories.map(category => (
										<SelectItem key={category.id} value={category.id}>
											<div className='flex items-center space-x-2'>
												<div
													className='w-3 h-3 rounded-full'
													style={{ backgroundColor: category.color }}
												/>
												<span>{category.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
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
							placeholder='Описание услуги...'
							rows={3}
						/>
					</div>

					{/* Duration and Price */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='duration'>Длительность (мин) *</Label>
							<Input
								id='duration'
								type='number'
								value={formData.duration}
								onChange={e =>
									setFormData({ ...formData, duration: Number(e.target.value) })
								}
								min='1'
								className={errors.duration ? 'border-destructive' : ''}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='price'>Цена *</Label>
							<Input
								id='price'
								type='number'
								value={formData.price}
								onChange={e =>
									setFormData({ ...formData, price: Number(e.target.value) })
								}
								min='0'
								step='0.01'
								className={errors.price ? 'border-destructive' : ''}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='bufferTime'>Время подготовки (мин)</Label>
							<Input
								id='bufferTime'
								type='number'
								value={formData.bufferTime}
								onChange={e =>
									setFormData({
										...formData,
										bufferTime: Number(e.target.value),
									})
								}
								min='0'
							/>
						</div>
					</div>

					{/* Required Qualifications */}
					<div className='space-y-2'>
						<Label>Требуемые квалификации *</Label>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
							{QUALIFICATION_OPTIONS.map(qualification => (
								<div
									key={qualification}
									className={`p-2 border rounded-md cursor-pointer transition-colors ${
										formData.requiredQualifications.includes(qualification)
											? 'bg-primary text-primary-foreground border-primary'
											: 'hover:bg-muted'
									}`}
									onClick={() => toggleQualification(qualification)}
								>
									<div className='text-sm font-medium'>{qualification}</div>
								</div>
							))}
						</div>
						{errors.requiredQualifications && (
							<p className='text-sm text-destructive'>
								{errors.requiredQualifications}
							</p>
						)}
					</div>

					{/* Compatible Space Types */}
					<div className='space-y-2'>
						<Label>Совместимые типы мест *</Label>
						<div className='grid grid-cols-3 gap-2'>
							{SPACE_TYPE_OPTIONS.map(spaceType => (
								<div
									key={spaceType}
									className={`p-2 border rounded-md cursor-pointer transition-colors ${
										formData.compatibleSpaceTypes.includes(spaceType)
											? 'bg-primary text-primary-foreground border-primary'
											: 'hover:bg-muted'
									}`}
									onClick={() => toggleSpaceType(spaceType)}
								>
									<div className='text-sm font-medium'>{spaceType}</div>
								</div>
							))}
						</div>
						{errors.compatibleSpaceTypes && (
							<p className='text-sm text-destructive'>
								{errors.compatibleSpaceTypes}
							</p>
						)}
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
						<Label htmlFor='isActive'>Активная услуга</Label>
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
