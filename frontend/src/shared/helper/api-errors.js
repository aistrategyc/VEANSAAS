// api-client.js
import { toastError, toastSuccess } from '@/lib/toast'

export const handleUserError = error => {
	// Пропускаем ошибки, которые помечены как не показывать пользователю
	if (error.config?._skipUserError) {
		return
	}

	if (error.response) {
		const status = error.response.status
		const data = error.response.data

		switch (status) {
			case 422:
				handleValidationError(data)
				break
			case 400:
				toastError('Неверный запрос: ' + getErrorMessage(data))
				break
			case 401:
				// Не показываем ошибку 401, так как это обрабатывается интерцептором
				break
			case 403:
				toastError('Доступ запрещен')
				break
			case 404:
				toastError('Ресурс не найден')
				break
			case 409:
				toastError('Конфликт данных: ' + getErrorMessage(data))
				break
			case 500:
				toastError('Внутренняя ошибка сервера')
				break
			case 502:
				toastError('Проблемы с соединением')
				break
			case 503:
				toastError('Сервис временно недоступен')
				break
			default:
				toastError(`Ошибка ${status}: ${getErrorMessage(data)}`)
		}
	} else if (error.request) {
		toastError('Нет соединения с сервером. Проверьте интернет-соединение.')
	} else {
		toastError('Ошибка при отправке запроса: ' + error.message)
	}
}

// Обработка ошибок валидации 422
export const handleValidationError = data => {
	const errors = data?.detail

	if (Array.isArray(errors) && errors.length > 0) {
		if (errors.length === 1) {
			// Для одной ошибки показываем простое сообщение
			const error = errors[0]
			const fieldName = formatFieldName(
				error.loc?.[error.loc.length - 1] || 'поле'
			)
			toastError(`${fieldName}: ${error.msg}`)
		} else {
			// Для нескольких ошибок показываем общее сообщение со списком
			const errorMessages = errors.map(error => {
				const field = formatFieldName(
					error.loc?.[error.loc.length - 1] || 'поле'
				)
				return `• ${field}: ${error.msg}`
			})

			toastError(`Обнаружены ошибки в форме:\n${errorMessages.join('\n')}`, {
				duration: 8000,
			})
		}
	} else {
		toastError('Ошибка валидации данных')
	}
}

export const formatFieldName = fieldName => {
	const fieldMap = {
		email: 'Email',
		password: 'Пароль',
		username: 'Имя пользователя',
		first_name: 'Имя',
		last_name: 'Фамилия',
		phone: 'Телефон',
		title: 'Название',
		description: 'Описание',
		name: 'Название',
		// добавьте другие поля по необходимости
	}

	return (
		fieldMap[fieldName] ||
		fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
	)
}

export const getErrorMessage = data => {
	if (!data) return 'Неизвестная ошибка'

	if (typeof data === 'string') return data
	if (data.message) return data.message
	if (data.msg) return data.msg
	if (data.detail) {
		if (typeof data.detail === 'string') return data.detail
		if (Array.isArray(data.detail)) {
			return data.detail.map(d => d.msg || JSON.stringify(d)).join(', ')
		}
	}

	return 'Произошла ошибка'
}
