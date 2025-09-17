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
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	CalendarIcon,
	Clock,
	User,
	Scissors,
	MapPin,
	Trash2,
	AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	mockAppointments,
	mockClients,
	mockServices,
	mockSpaces,
	mockMasters,
} from '@/lib/mock-data'

// Mock masters data

export function AppointmentModal({
	isOpen,
	onClose,
	appointment,
	selectedSlot,
	onSave,
	onDelete,
}) {
	const [formData, setFormData] = useState({
		clientId: '',
		masterId: '',
		serviceId: '',
		spaceId: '',
		startTime: new Date(),
		endTime: new Date(),
		notes: '',
		price: 0,
	})
	const [errors, setErrors] = useState([])
	const [availableMasters, setAvailableMasters] = useState(mockMasters)
	const [availableSpaces, setAvailableSpaces] = useState(mockSpaces)

	useEffect(() => {
		if (appointment) {
			// Edit mode
			setFormData({
				clientId: appointment.clientId,
				masterId: appointment.masterId,
				serviceId: appointment.serviceId,
				spaceId: appointment.spaceId,
				startTime: new Date(appointment.startTime),
				endTime: new Date(appointment.endTime),
				notes: appointment.notes || '',
				price: appointment.price,
			})
		} else if (selectedSlot) {
			// Create mode
			setFormData({
				clientId: '',
				masterId: selectedSlot.resourceId || '',
				serviceId: '',
				spaceId: '',
				startTime: selectedSlot.start,
				endTime: selectedSlot.end,
				notes: '',
				price: 0,
			})
		}
	}, [appointment, selectedSlot])

	useEffect(() => {
		// Filter masters by service qualifications
		if (formData.serviceId) {
			const service = mockServices.find(s => s.id === formData.serviceId)
			if (service) {
				const qualified = mockMasters.filter(master =>
					service.requiredQualifications.every(qual =>
						master.qualifications?.includes(qual)
					)
				)
				setAvailableMasters(qualified)
				console.log(qualified)

				// Filter spaces by service compatibility
				const compatible = mockSpaces.filter(space =>
					service.compatibleSpaceTypes?.includes(space.type)
				)
				setAvailableSpaces(compatible)

				// Update price
				setFormData(prev => ({ ...prev, price: service.price }))

				// Update end time based on service duration
				const newEndTime = new Date(formData.startTime)
				newEndTime.setMinutes(newEndTime.getMinutes() + service.duration)
				setFormData(prev => ({ ...prev, endTime: newEndTime }))
			}
		} else {
			setAvailableMasters(mockMasters)
			setAvailableSpaces(mockSpaces)
		}
	}, [formData.serviceId, formData.startTime])

	const validateForm = () => {
		const newErrors = []

		if (!formData.clientId) newErrors.push('Выберите клиента')
		if (!formData.masterId) newErrors.push('Выберите мастера')
		if (!formData.serviceId) newErrors.push('Выберите услугу')
		if (!formData.spaceId) newErrors.push('Выберите место')

		// Check master qualifications
		const service = mockServices.find(s => s.id === formData.serviceId)
		const master = mockMasters.find(m => m.id === formData.masterId)
		if (service && master) {
			const hasQualifications = service.requiredQualifications.every(qual =>
				master.qualifications.includes(qual)
			)
			if (!hasQualifications) {
				newErrors.push('У выбранного мастера нет необходимой квалификации')
			}
		}

		// Check space compatibility
		const space = mockSpaces.find(s => s.id === formData.spaceId)
		if (service && space) {
			const isCompatible = service.compatibleSpaceTypes.includes(space.type)
			if (!isCompatible) {
				newErrors.push('Выбранная услуга несовместима с данным местом')
			}
		}

		setErrors(newErrors)
		return newErrors.length === 0
	}

	const handleSave = () => {
		if (!validateForm()) return

		const appointmentData = {
			...formData,
			startTime: formData.startTime.toISOString(),
			endTime: formData.endTime.toISOString(),
			status: 'SCHEDULED',
			currency: 'RUB',
			organizationId: 'org1',
		}

		if (appointment) {
			appointmentData.id = appointment.id
		}

		onSave(appointmentData)
	}

	const handleDelete = () => {
		if (appointment) {
			onDelete(appointment.id)
		}
	}

	const selectedClient = mockClients.find(c => c.id === formData.clientId)
	const selectedService = mockServices.find(s => s.id === formData.serviceId)
	const selectedMaster = mockMasters.find(m => m.id === formData.masterId)
	const selectedSpace = mockSpaces.find(s => s.id === formData.spaceId)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{appointment ? 'Редактировать запись' : 'Новая запись'}
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-6'>
					{errors.length > 0 && (
						<Alert variant='destructive'>
							<AlertTriangle className='h-4 w-4' />
							<AlertDescription>
								<ul className='list-disc list-inside space-y-1'>
									{errors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							</AlertDescription>
						</Alert>
					)}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Client Selection */}
						<div className='space-y-2'>
							<Label htmlFor='client'>Клиент</Label>
							<Select
								value={formData.clientId}
								onValueChange={value =>
									setFormData({ ...formData, clientId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите клиента' />
								</SelectTrigger>
								<SelectContent>
									{mockClients.map(client => (
										<SelectItem key={client.id} value={client.id}>
											<div className='flex items-center space-x-2'>
												<User className='h-4 w-4' />
												<span>
													{client.firstName} {client.lastName}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{selectedClient && (
								<div className='text-sm text-muted-foreground'>
									{selectedClient.phone && (
										<div>Телефон: {selectedClient.phone}</div>
									)}
									{selectedClient.email && (
										<div>Email: {selectedClient.email}</div>
									)}
								</div>
							)}
						</div>

						{/* Service Selection */}
						<div className='space-y-2'>
							<Label htmlFor='service'>Услуга</Label>
							<Select
								value={formData.serviceId}
								onValueChange={value =>
									setFormData({ ...formData, serviceId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите услугу' />
								</SelectTrigger>
								<SelectContent>
									{mockServices.map(service => (
										<SelectItem key={service.id} value={service.id}>
											<div className='flex items-center justify-between w-full'>
												<div className='flex items-center space-x-2'>
													<Scissors className='h-4 w-4' />
													<span>{service.name}</span>
												</div>
												<Badge variant='outline'>{service.duration} мин</Badge>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{selectedService && (
								<div className='text-sm text-muted-foreground'>
									<div>Длительность: {selectedService.duration} минут</div>
									<div>Цена: {selectedService.price} ₽</div>
								</div>
							)}
						</div>

						{/* Master Selection */}
						<div className='space-y-2'>
							<Label htmlFor='master'>Мастер</Label>
							<Select
								value={formData.masterId}
								onValueChange={value =>
									setFormData({ ...formData, masterId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите мастера' />
								</SelectTrigger>
								<SelectContent>
									{availableMasters.map(master => (
										<SelectItem key={master.id} value={master.id}>
											<div className='flex items-center space-x-2'>
												<User className='h-4 w-4' />
												<span>{master.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{selectedMaster && (
								<div className='flex flex-wrap gap-1'>
									{selectedMaster.qualifications?.map(qual => (
										<Badge key={qual} variant='secondary' className='text-xs'>
											{qual}
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* Space Selection */}
						<div className='space-y-2'>
							<Label htmlFor='space'>Место</Label>
							<Select
								value={formData.spaceId}
								onValueChange={value =>
									setFormData({ ...formData, spaceId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Выберите место' />
								</SelectTrigger>
								<SelectContent>
									{availableSpaces.map(space => (
										<SelectItem key={space.id} value={space.id}>
											<div className='flex items-center space-x-2'>
												<MapPin className='h-4 w-4' />
												<span>{space.name}</span>
												<Badge variant='outline'>{space.type}</Badge>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{selectedSpace && (
								<div className='text-sm text-muted-foreground'>
									<div>Тип: {selectedSpace.type}</div>
									{selectedSpace.equipment && (
										<div>
											Оборудование: {selectedSpace.equipment.join(', ')}
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Date and Time */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label>Дата и время начала</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										className='w-full justify-start bg-transparent'
									>
										<CalendarIcon className='mr-2 h-4 w-4' />
										{format(formData.startTime, 'd MMMM yyyy, HH:mm', {
											locale: ru,
										})}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={formData.startTime}
										onSelect={date => {
											if (date) {
												const newStart = new Date(date)
												newStart.setHours(
													formData.startTime.getHours(),
													formData.startTime.getMinutes()
												)
												setFormData({ ...formData, startTime: newStart })
											}
										}}
										initialFocus
									/>
									<div className='p-3 border-t'>
										<Input
											type='time'
											value={format(formData.startTime, 'HH:mm')}
											onChange={e => {
												const [hours, minutes] = e.target.value
													.split(':')
													.map(Number)
												const newStart = new Date(formData.startTime)
												newStart.setHours(hours, minutes)
												setFormData({ ...formData, startTime: newStart })
											}}
										/>
									</div>
								</PopoverContent>
							</Popover>
						</div>

						<div className='space-y-2'>
							<Label>Время окончания</Label>
							<div className='flex items-center space-x-2 p-3 border rounded-md bg-muted/50'>
								<Clock className='h-4 w-4 text-muted-foreground' />
								<span>{format(formData.endTime, 'HH:mm', { locale: ru })}</span>
								<span className='text-sm text-muted-foreground'>
									(
									{Math.round(
										(formData.endTime.getTime() -
											formData.startTime.getTime()) /
											(1000 * 60)
									)}{' '}
									мин)
								</span>
							</div>
						</div>
					</div>

					{/* Price */}
					<div className='space-y-2'>
						<Label htmlFor='price'>Цена</Label>
						<Input
							id='price'
							type='number'
							value={formData.price}
							onChange={e =>
								setFormData({ ...formData, price: Number(e.target.value) })
							}
							placeholder='0'
						/>
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
							placeholder='Дополнительная информация о записи...'
							rows={3}
						/>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-between pt-4'>
						<div>
							{appointment && (
								<Button variant='destructive' onClick={handleDelete}>
									<Trash2 className='h-4 w-4 mr-2' />
									Удалить
								</Button>
							)}
						</div>
						<div className='flex items-center space-x-2'>
							<Button variant='outline' onClick={onClose}>
								Отмена
							</Button>
							<Button onClick={handleSave}>Сохранить</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
