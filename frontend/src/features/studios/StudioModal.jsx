import { useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaStudio } from './lib/validation'
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'

export const StudioModal = ({
	isOpen,
	onClose,
	handleCreate,
	handleUpdate,
	studio = null,
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(schemaStudio),
	})

	useEffect(() => {
		if (studio) {
			reset({
				name: studio.name || '',
				phone_number: studio.phone_number || null,
				address: studio.address || null,
			})
		}
	}, [studio, reset])

	const onSubmit = data => {
		if (studio) {
			handleUpdate(studio.uuid, data)
		} else {
			handleCreate(data)
		}
		reset()
		onClose()
	}

	const title = studio ? 'Редактировать студию' : 'Создать студию'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<FormInput
						title='Название студии'
						placeholder={'Название'}
						type='text'
						name='name'
						control={control}
						error={errors.name?.message}
					/>
					<FormInput
						title='Номер телефона'
						type='tel'
						name='phone_number'
						control={control}
						error={errors.phone_number?.message}
					/>
					<FormInput
						title='Адрес'
						type='text'
						name='address'
						placeholder={'Адрес'}
						control={control}
						error={errors.address?.message}
					/>
				</div>

				<div className='flex items-center justify-between pt-4'>
					<div className='flex items-center space-x-2 ml-auto'>
						<Button type='button' variant='outline' onClick={onClose}>
							Отмена
						</Button>
						<Button type='submit'>{studio ? 'Сохранить' : 'Создать'}</Button>
					</div>
				</div>
			</Form>
		</DialogWrapper>
	)
}
