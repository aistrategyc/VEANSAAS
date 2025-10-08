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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function ClientModal({ isOpen, onClose, client, onSave }) {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		gender: '',
		notes: '',
		isActive: true,
		preferences: {
			preferredMasters: [],
			allergies: [],
			skinType: '',
		},
	})

	const [newAllergy, setNewAllergy] = useState('')
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (client) {
			setFormData({
				firstName: client.firstName,
				lastName: client.lastName,
				email: client.email || '',
				phone: client.phone || '',
				dateOfBirth: client.dateOfBirth || '',
				gender: client.gender || '',
				notes: client.notes || '',
				isActive: client.isActive,
				preferences: {
					preferredMasters: client.preferences?.preferredMasters || [],
					allergies: client.preferences?.allergies || [],
					skinType: client.preferences?.skinType || '',
				},
			})
		} else {
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				dateOfBirth: '',
				gender: '',
				notes: '',
				isActive: true,
				preferences: {
					preferredMasters: [],
					allergies: [],
					skinType: '',
				},
			})
		}
		setErrors({})
	}, [client, isOpen])

	const validateForm = () => {
		const newErrors = {}

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'Имя обязательно'
		}
		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Фамилия обязательна'
		}
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Некорректный email'
		}
		if (formData.phone && !/^[+]?[0-9\s\-$$$$]{10,}$/.test(formData.phone)) {
			newErrors.phone = 'Некорректный номер телефона'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = () => {
		if (!validateForm()) return

		const clientData = {
			...formData,
			email: formData.email || undefined,
			phone: formData.phone || undefined,
			dateOfBirth: formData.dateOfBirth || undefined,
			gender: formData.gender || undefined,
			notes: formData.notes || undefined,
			preferences: {
				...formData.preferences,
				preferredMasters:
					formData.preferences.preferredMasters.length > 0
						? formData.preferences.preferredMasters
						: undefined,
				allergies:
					formData.preferences.allergies.length > 0
						? formData.preferences.allergies
						: undefined,
				skinType: formData.preferences.skinType || undefined,
			},
		}

		onSave(clientData)
	}

	const addAllergy = () => {
		if (
			newAllergy.trim() &&
			!formData.preferences.allergies.includes(newAllergy.trim())
		) {
			setFormData({
				...formData,
				preferences: {
					...formData.preferences,
					allergies: [...formData.preferences.allergies, newAllergy.trim()],
				},
			})
			setNewAllergy('')
		}
	}

	const removeAllergy = allergy => {
		setFormData({
			...formData,
			preferences: {
				...formData.preferences,
				allergies: formData.preferences.allergies.filter(a => a !== allergy),
			},
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{client ? 'Редактировать клиента' : 'Новый клиент'}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Basic Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>Имя *</Label>
							<Input
								id='firstName'
								value={formData.firstName}
								onChange={e =>
									setFormData({ ...formData, firstName: e.target.value })
								}
								placeholder='Введите имя'
								className={errors.firstName ? 'border-destructive' : ''}
							/>
							{errors.firstName && (
								<p className='text-sm text-destructive'>{errors.firstName}</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='lastName'>Фамилия *</Label>
							<Input
								id='lastName'
								value={formData.lastName}
								onChange={e =>
									setFormData({ ...formData, lastName: e.target.value })
								}
								placeholder='Введите фамилию'
								className={errors.lastName ? 'border-destructive' : ''}
							/>
							{errors.lastName && (
								<p className='text-sm text-destructive'>{errors.lastName}</p>
							)}
						</div>
					</div>

					{/* Contact Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={e =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder='client@example.com'
								className={errors.email ? 'border-destructive' : ''}
							/>
							{errors.email && (
								<p className='text-sm text-destructive'>{errors.email}</p>
							)}
						</div>

<<<<<<< HEAD
						<div className='space-y-2'>
							<Label htmlFor='phone'>Телефон</Label>
							<Input
								id='phone'
								value={formData.phone}
								onChange={e =>
									setFormData({ ...formData, phone: e.target.value })
								}
								placeholder='+48 3242 1333 1'
								className={errors.phone ? 'border-destructive' : ''}
							/>
							{errors.phone && (
								<p className='text-sm text-destructive'>{errors.phone}</p>
							)}
						</div>
					</div>
=======
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+48 (999) 123-45-67"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
>>>>>>> main

					{/* Personal Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label>Дата рождения</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										className='w-full justify-start bg-transparent'
									>
										<CalendarIcon className='mr-2 h-4 w-4' />
										{formData.dateOfBirth
											? format(new Date(formData.dateOfBirth), 'd MMMM yyyy', {
													locale: ru,
											  })
											: 'Выберите дату'}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={
											formData.dateOfBirth
												? new Date(formData.dateOfBirth)
												: undefined
										}
										onSelect={date => {
											setFormData({
												...formData,
												dateOfBirth: date
													? date.toISOString().split('T')[0]
													: '',
											})
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='gender'>Пол</Label>
							<Select
								value={formData.gender}
								onValueChange={value =>
									setFormData({ ...formData, gender: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите пол' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='FEMALE'>Женский</SelectItem>
									<SelectItem value='MALE'>Мужской</SelectItem>
									<SelectItem value='OTHER'>Другое</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Preferences */}
					<div className='space-y-4'>
						<h3 className='text-lg font-medium'>Предпочтения</h3>

						<div className='space-y-2'>
							<Label htmlFor='skinType'>Тип кожи</Label>
							<Select
								value={formData.preferences.skinType}
								onValueChange={value =>
									setFormData({
										...formData,
										preferences: { ...formData.preferences, skinType: value },
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите тип кожи' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Нормальная'>Нормальная</SelectItem>
									<SelectItem value='Сухая'>Сухая</SelectItem>
									<SelectItem value='Жирная'>Жирная</SelectItem>
									<SelectItem value='Комбинированная'>
										Комбинированная
									</SelectItem>
									<SelectItem value='Чувствительная'>Чувствительная</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label>Аллергии</Label>
							<div className='flex space-x-2'>
								<Input
									value={newAllergy}
									onChange={e => setNewAllergy(e.target.value)}
									placeholder='Добавить аллергию'
									onKeyPress={e => e.key === 'Enter' && addAllergy()}
								/>
								<Button type='button' onClick={addAllergy} variant='outline'>
									Добавить
								</Button>
							</div>
							{formData.preferences.allergies.length > 0 && (
								<div className='flex flex-wrap gap-2 mt-2'>
									{formData.preferences.allergies.map(allergy => (
										<Badge
											key={allergy}
											variant='destructive'
											className='flex items-center gap-1'
										>
											{allergy}
											<X
												className='h-3 w-3 cursor-pointer'
												onClick={() => removeAllergy(allergy)}
											/>
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Notes */}
					<div className='space-y-2'>
						<Label htmlFor='notes'>Заметки</Label>
						<Textarea
							id='notes'
							value={formData.notes}
							onChange={e =>
								setFormData({ ...formData, notes: e.target.value })
							}
							placeholder='Дополнительная информация о клиенте...'
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
						<Label htmlFor='isActive'>Активный клиент</Label>
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
