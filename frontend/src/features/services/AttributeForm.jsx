import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import { FormInput } from '@/shared/ui/input/FormInput'
import FormSelect from '@/shared/ui/select/Select'
import { ATTRIBUTE_TYPES_SELECT } from './lib/constants'
import FormSwitch from '@/shared/ui/switch/FormSwitch'

export const AttributeForm = ({ onAppendAttribute }) => {
	const [newAttributeValueInput, setNewAttributeValueInput] = useState('')

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm({
		defaultValues: {
			name: '',
			description: '',
			type: '',
			is_required: false,
			attribute_options: [],
		},
	})

	const type = watch('type')
	const values = watch('attribute_options')

	const handleAddAttributeValue = () => {
		if (!newAttributeValueInput.trim()) return

		const currentValues = values || []
		setValue('attribute_options', [
			...currentValues,
			newAttributeValueInput.trim(),
		])
		setNewAttributeValueInput('')
	}

	const handleRemoveAttributeValue = index => {
		const currentValues = values || []
		setValue(
			'attribute_options',
			currentValues.filter((_, i) => i !== index)
		)
	}

	const onSubmit = data => {
		console.log(data)
		const newAttribute = {
			...data,
			id: Date.now().toString(),
			attribute_options: data.values || [],
		}

		onAppendAttribute(newAttribute)

		reset()
		setNewAttributeValueInput('')
	}

	return (
		<div className='space-y-4 p-4 border rounded-lg'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
				<FormInput
					title='Название *'
					placeholder='Атрибут'
					type='text'
					name={'name'}
					control={control}
					className={errors.name ? 'border-destructive' : 'h-9'}
					error={errors.name?.message}
				/>
				<FormSelect
					items={ATTRIBUTE_TYPES_SELECT}
					title='Тип *'
					placeholder={'Выберите тип'}
					name='type'
					control={control}
					error={errors.type?.message}
				/>

				<Button
					type='button'
					onClick={handleSubmit(onSubmit)}
					className='h-9 w-full'
					size='sm'
				>
					<Plus className='h-3 w-3 mr-1' />
					Добавить
				</Button>
			</div>

			<FormInput
				title='Описание'
				placeholder='Описание атрибута...'
				type='textarea'
				name={'description'}
				control={control}
				rows={2}
				className='resize-none min-h-[80px]'
				error={errors.description?.message}
			/>

			{type === 'select' && (
				<div className='space-y-2'>
					<Label className='text-sm'>Значения *</Label>
					<div className='flex gap-2'>
						<Input
							value={newAttributeValueInput}
							onChange={e => setNewAttributeValueInput(e.target.value)}
							placeholder='Новое значение'
							className='h-8 flex-1'
						/>
						<Button
							type='button'
							onClick={handleAddAttributeValue}
							variant='outline'
							size='sm'
							className='h-8'
						>
							<Plus className='h-3 w-3' />
						</Button>
					</div>

					{values && values.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{values.map((value, index) => (
								<Badge
									key={index}
									variant='secondary'
									className='text-xs px-2 py-1 flex items-center gap-1'
								>
									{value}
									<button
										type='button'
										onClick={() => handleRemoveAttributeValue(index)}
										className='hover:text-destructive'
									>
										<Trash2 className='h-3 w-3' />
									</button>
								</Badge>
							))}
						</div>
					)}
					{type === 'select' && (!values || values.length === 0) && (
						<p className='text-sm text-destructive'>
							Добавьте хотя бы одно значение для списка
						</p>
					)}
				</div>
			)}
			<FormSwitch name='is_required' control={control} title='Обязательный' />
		</div>
	)
}
