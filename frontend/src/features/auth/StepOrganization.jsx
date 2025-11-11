import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/shared/ui/form/Form'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { PLANS } from '@/features/auth/lib/constants'
import { useEffect } from 'react'

export const StepOrganization = ({ onSubmit, onBack, initialData = {} }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onChange',
		defaultValues: initialData,
	})

	useEffect(() => {
		reset(initialData)
	}, [initialData, reset])

	return (
		<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			<FormInput
				title='Название организации'
				name='name'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.name?.message}
			/>
			<FormSelect
				title='План'
				items={PLANS}
				name='plan_type'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.plan_type?.message}
			/>
			<FormInput
				title='Описание'
				type='textarea'
				name='description'
				rows={3}
				className='resize-none min-h-[80px]'
				control={control}
				error={errors.description?.message}
			/>
			<FormInput
				title='Название студии'
				name='studio.name'
				control={control}
				rules={{ required: 'Обязательное поле' }}
				error={errors.studio?.name?.message}
			/>

			<div className='flex justify-between pt-4'>
				<Button type='button' variant='outline' onClick={onBack}>
					Назад
				</Button>
				<Button type='submit'>Завершить</Button>
			</div>
		</Form>
	)
}
