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
import { DialogWrapper } from '@/widgets/wrapper/DialogWrapper'
import FormSelect from '@/shared/ui/select/Select'
import { SELECT_ROLES } from './lib/constants'

export const StaffModal = ({
	isOpen,
	onClose,
	handleCreate,
	handleUpdate,
	currentStudio,
	staff = null,
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			email: '',
			roles: '',
		},
	})

	const onSubmit = data => {
		const dataInvite = {
			roles: [data.roles],
			email: data.email,
		}
		if (currentStudio) {
			handleCreate(currentStudio.uuid, dataInvite)
		}

		onClose()
	}

	const title = staff ? 'Редактировать студию' : 'Создать студию'

	return (
		<DialogWrapper title={title} isOpen={isOpen} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<FormInput
						title='Почта'
						type='email'
						placeholder='Укажите почту'
						name='email'
						control={control}
						error={errors.email?.message}
					/>
					<FormSelect
						title='Роль'
						items={SELECT_ROLES}
						placeholder={'Выберите роль'}
						name='roles'
						control={control}
						error={errors.roles?.message}
					/>
				</div>

				<div className='flex items-center justify-between pt-4'>
					<div className='flex items-center space-x-2 ml-auto'>
						<Button type='button' variant='outline' onClick={onClose}>
							Отмена
						</Button>
						<Button type='submit'>{staff ? 'Сохранить' : 'Создать'}</Button>
					</div>
				</div>
			</Form>
		</DialogWrapper>
	)
}
