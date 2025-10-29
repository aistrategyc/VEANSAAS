// utils/validationSchemas.js
import * as yup from 'yup'

export const createAppointmentSchema = (serviceAttributes = []) => {
	return yup.object({
		customer_uuid: yup.string().required('Выберите клиента'),
		master_uuid: yup.string().required('Выберите мастера'),
		service: yup.object().required('Выберите услугу'),
		date_time: yup.string().required('Выберите дату и время'),
		duration: yup
			.number()
			.min(1, 'Длительность должна быть больше 0')
			.required('Укажите длительность'),
		price: yup
			.number()
			.min(0, 'Цена не может быть отрицательной')
			.required('Укажите цену'),
		note: yup.string(),
		attributes: yup.array().of(
			yup.lazy(obj => {
				if (obj && typeof obj === 'object' && 'attribute_uuid' in obj) {
					const attributeUuid = obj.attribute_uuid
					const attributeConfig = serviceAttributes.find(
						a => a.uuid === attributeUuid
					)

					if (!attributeConfig) {
						return yup.object({
							attribute_uuid: yup.string(),
							value: yup.string(),
							option_uuid: yup.string(),
						})
					}

					if (attributeConfig.type === 'select') {
						return yup.object({
							attribute_uuid: yup.string().required(),
							option_uuid: attributeConfig.is_required
								? yup.string().required('Выберите значение')
								: yup.string(),
							value: yup.string(),
						})
					} else {
						let valueValidation = yup.string()

						if (attributeConfig.is_required) {
							valueValidation = valueValidation.required('Это поле обязательно')
						}

						return yup.object({
							attribute_uuid: yup.string().required(),
							value: valueValidation,
							option_uuid: yup.string(),
						})
					}
				}

				return yup.object()
			})
		),
	})
}
