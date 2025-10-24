// components/ServiceAttributesForm.jsx
import { useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { AttributeField } from './AttributeField'

export function FormServiceAttributes({
	service,
	services,
	control,
	errors,
	setValue,
	watch,
}) {
	const { fields, replace } = useFieldArray({
		control,
		name: 'attributes',
	})

	const watchServiceUuid = watch('service_uuid')

	// Обработчик изменения услуги
	useEffect(() => {
		if (watchServiceUuid) {
			const selectedService = services?.find(s => s.uuid === watchServiceUuid)
			const attributes = selectedService?.category?.attributes || []

			// Создаем начальную структуру для атрибутов
			const initialAttributes = attributes.map(attribute => ({
				attribute_uuid: attribute.uuid,
				value: attribute.type === 'boolean' ? 'false' : '',
				option_uuid: '',
			}))

			replace(initialAttributes)
		} else {
			replace([])
		}
	}, [watchServiceUuid, services, setValue, replace])

	// Если услуга передана напрямую (для редактирования)
	useEffect(() => {
		if (service) {
			const attributes = service?.category?.attributes || []
			const initialAttributes = attributes.map(attribute => ({
				attribute_uuid: attribute.uuid,
				value: attribute.type === 'boolean' ? 'false' : '',
				option_uuid: '',
			}))
			replace(initialAttributes)
		}
	}, [service, replace])

	const serviceAttributes =
		service?.category?.attributes ||
		services?.find(s => s.uuid === watchServiceUuid)?.category?.attributes ||
		[]

	if (serviceAttributes.length === 0) {
		return null
	}

	return (
		<div className='space-y-4 p-4 border rounded-lg'>
			{serviceAttributes.map((attribute, index) => (
				<div key={attribute.uuid}>
					{/* Скрытые поля для attribute_uuid */}
					<input
						type='hidden'
						{...control.register(`attributes.${index}.attribute_uuid`)}
						value={attribute.uuid}
					/>
					<AttributeField
						attribute={attribute}
						control={control}
						index={index}
						errors={errors}
					/>
				</div>
			))}
		</div>
	)
}
