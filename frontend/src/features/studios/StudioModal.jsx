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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export const StudioModal = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	studio = null,
}) => {
	const [formData, setFormData] = useState({
		name: '',
	})
	const [errors, setErrors] = useState([])

	useEffect(() => {
		if (isOpen) {
			if (studio) {
				setFormData({
					name: studio.name || '',
				})
			} else {
				setFormData({
					name: '',
				})
			}
			setErrors([])
		}
	}, [isOpen, studio])

	const validateForm = () => {
		const newErrors = []

		if (!formData.name.trim()) {
			newErrors.push('Название студии обязательно для заполнения')
		}

		if (formData.name.trim().length < 2) {
			newErrors.push('Название студии должно содержать минимум 2 символа')
		}

		if (formData.name.trim().length > 100) {
			newErrors.push('Название студии не должно превышать 100 символов')
		}

		setErrors(newErrors)
		return newErrors.length === 0
	}

	const handleSave = () => {
		if (!validateForm()) return

		const studioData = {
			name: formData.name.trim(),
		}

		if (studio) {
			studioData.id = studio.id
		}

		onSave(studioData)
		onClose()
	}

	const handleDelete = () => {
		if (studio) {
			onDelete(studio.id)
		}
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{studio ? 'Редактировать студию' : 'Создать студию'}
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

					<div className='space-y-2'>
						<Label htmlFor='name'>Название студии *</Label>
						<Input
							id='name'
							name='name'
							value={formData.name}
							onChange={handleInputChange}
							placeholder='Введите название студии'
							className='w-full'
						/>
					</div>

					<div className='flex items-center justify-between pt-4'>
						<div className='flex items-center space-x-2'>
							{studio && (
								<Button variant='destructive' onClick={handleDelete}>
									Удалить
								</Button>
							)}
						</div>
						<div className='flex items-center space-x-2'>
							<Button variant='outline' onClick={onClose}>
								Отмена
							</Button>
							<Button onClick={handleSave}>
								{studio ? 'Сохранить' : 'Создать'}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
