import { toastError, toastSuccess } from '@/lib/toast'

export const handleUserError = error => {
	if (error.config?._skipUserError) {
		return
	}
	if (error.response) {
		const status = error.response.status
		const data = error.response.data

		switch (status) {
			case 400:
				handleBadRequestError(data)
				break
			case 401:
				handleBadRequestError(data)
				break
			case 422:
				handleValidationError(data)
				break
			case 403:
				toastError('Доступ запрещен')
				break
			case 404:
				handleNotFoundError(data)
				break
			case 405:
				toastError('Метод не разрешен')
				break
			case 409:
				toastError('Конфликт данных: ' + getErrorMessage(data))
				break
			case 413:
				toastError('Слишком большой объем данных')
				break
			case 415:
				toastError('Неподдерживаемый тип данных')
				break
			case 429:
				handleRateLimitError(data)
				break
			case 500:
				toastError('Внутренняя ошибка сервера')
				break
			case 502:
				toastError('Проблемы с соединением (Bad Gateway)')
				break
			case 503:
				toastError('Сервис временно недоступен')
				break
			case 504:
				toastError('Таймаут соединения')
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

export const handleValidationError = data => {
	const errors = data?.detail

	if (Array.isArray(errors) && errors.length > 0) {
		const formattedErrors = formatValidationErrors(errors)

		if (formattedErrors.length === 1) {
			toastError(formattedErrors[0])
		} else {
			toastError(`Обнаружены ошибки в форме:\n${formattedErrors.join('\n')}`, {
				duration: 8000,
			})
		}
	} else {
		toastError('Ошибка валидации данных')
	}
}

export const handleBadRequestError = data => {
	// Проверяем вложенную структуру: {detail: {detail: "...", errors: {...}}}
	if (data?.detail && typeof data.detail === 'object') {
		// Если внутри detail есть еще detail и errors
		if (data.detail.errors && typeof data.detail.errors === 'object') {
			handleNestedErrors(data.detail)
			return
		}
		// Если внутри detail есть прямые поля ошибок
		if (data.detail.email?.message || data.detail.phone?.message) {
			handleFieldErrors(data.detail)
			return
		}
	}

	// Проверяем, является ли это структурой валидации FastAPI
	if (data?.detail && Array.isArray(data.detail)) {
		handleValidationError(data)
		return
	}

	// Обработка структуры с прямыми errors
	if (data?.errors && typeof data.errors === 'object') {
		handleNestedErrors(data)
		return
	}

	// Обработка структуры с прямыми полями ошибок
	if (data?.email?.message || data?.phone?.message) {
		handleFieldErrors(data)
		return
	}

	// Обычное сообщение об ошибке
	const message = getErrorMessage(data)
	toastError(message || 'Неверный запрос')
}

export const handleNotFoundError = data => {
	const message = getErrorMessage(data)
	if (message && message !== 'Not Found') {
		toastError(message)
	} else {
		toastError('Ресурс не найден')
	}
}

export const handleRateLimitError = data => {
	const message = getErrorMessage(data)
	if (message) {
		toastError(message)
	} else {
		toastError('Слишком много запросов. Попробуйте позже.')
	}
}

export const handleNestedErrors = data => {
	// Пробуем извлечь все ошибки универсальным способом
	const allMessages = extractAllErrorMessages(data)

	if (allMessages.length > 0) {
		if (allMessages.length === 1) {
			toastError(allMessages[0])
		} else {
			toastError(
				`Обнаружены ошибки:\n${allMessages.map(msg => `• ${msg}`).join('\n')}`,
				{
					duration: 8000,
				}
			)
		}
		return
	}

	// Fallback: пытаемся найти ошибки в известных структурах
	const errors = data.errors || data
	const errorMessages = []

	if (typeof errors === 'object') {
		Object.keys(errors).forEach(field => {
			if (field === 'detail' || field === 'message') return // Пропускаем системные поля

			const error = errors[field]
			if (error && typeof error === 'object') {
				if (error.message) {
					const fieldName = formatFieldName(field)
					errorMessages.push(`• ${fieldName}: ${error.message}`)
				} else if (typeof error === 'string') {
					errorMessages.push(`• ${formatFieldName(field)}: ${error}`)
				}
			}
		})
	}

	if (errorMessages.length > 0) {
		if (errorMessages.length === 1) {
			toastError(errorMessages[0].replace('• ', ''))
		} else {
			toastError(`Обнаружены ошибки:\n${errorMessages.join('\n')}`, {
				duration: 8000,
			})
		}
	} else {
		toastError(data.detail || 'Ошибка валидации данных')
	}
}

export const formatValidationErrors = errors => {
	return errors.map(error => {
		const location = error.loc || []
		const field = location[location.length - 1]
		const fieldName = formatFieldName(field)
		const message = getValidationMessage(error.msg, error.type)

		return field ? `• ${fieldName}: ${message}` : `• ${message}`
	})
}

export const getValidationMessage = (msg, type) => {
	if (msg && msg !== 'string') return msg

	const messageMap = {
		'value_error.missing': 'Обязательное поле',
		'value_error.any_str.min_length': 'Слишком короткое значение',
		'value_error.any_str.max_length': 'Слишком длинное значение',
		'type_error.integer': 'Должно быть числом',
		'type_error.float': 'Должно быть числом с плавающей точкой',
		'type_error.bool': 'Должно быть true или false',
		'value_error.email': 'Неверный формат email',
		'value_error.url': 'Неверный формат URL',
		'value_error.datetime': 'Неверный формат даты',
		'value_error.number.not_ge': 'Значение должно быть больше или равно',
		'value_error.number.not_le': 'Значение должно быть меньше или равно',
		'value_error.number.not_gt': 'Значение должно быть больше',
		'value_error.number.not_lt': 'Значение должно быть меньше',
		'value_error.const': 'Недопустимое значение',
		'value_error.enum': 'Недопустимое значение для перечисления',
		'value_error.json': 'Неверный JSON формат',
		'value_error.extra': 'Недопустимое дополнительное поле',
	}

	return messageMap[type] || msg || 'Неверное значение'
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
		body: 'Тело запроса',
		query: 'Параметр запроса',
		path: 'Параметр пути',
		header: 'Заголовок',
		cookie: 'Cookie',
		// добавьте другие поля по необходимости
	}

	return (
		fieldMap[fieldName] ||
		fieldName
			.replace(/_/g, ' ')
			.replace(/\b\w/g, l => l.toUpperCase())
			.replace(/body /g, '')
			.replace(/query /g, '')
			.replace(/path /g, '')
	)
}


export const handleFieldErrors = data => {
	const errorMessages = []

	// Ищем поля с ошибками (исключаем системные поля like detail, errors)
	const systemFields = ['detail', 'errors', 'message', 'code']

	Object.keys(data).forEach(field => {
		if (
			!systemFields.includes(field) &&
			data[field] &&
			typeof data[field] === 'object'
		) {
			const error = data[field]
			if (error.message) {
				const fieldName = formatFieldName(field)
				errorMessages.push(`• ${fieldName}: ${error.message}`)
			}
		}
	})

	if (errorMessages.length > 0) {
		if (errorMessages.length === 1) {
			toastError(errorMessages[0].replace('• ', ''))
		} else {
			toastError(`Обнаружены ошибки:\n${errorMessages.join('\n')}`, {
				duration: 8000,
			})
		}
	} else {
		toastError(data.detail || 'Ошибка валидации данных')
	}
}

export const getErrorMessage = data => {
	if (!data) return 'Неизвестная ошибка'

	// Если это строка
	if (typeof data === 'string') return data

	// Стандартная структура FastAPI с detail
	if (data.detail) {
		if (typeof data.detail === 'string') return data.detail
		if (Array.isArray(data.detail)) {
			// Для массива ошибок возвращаем первую ошибку
			const firstError = data.detail[0]
			if (firstError && firstError.msg) {
				return firstError.msg
			}
			return 'Ошибка валидации данных'
		}
	}

	// Обработка новой структуры с errors
	if (data.errors && typeof data.errors === 'object') {
		const firstField = Object.keys(data.errors)[0]
		if (firstField && data.errors[firstField]?.message) {
			return data.errors[firstField].message
		}
	}

	// Обработка прямой структуры с полями ошибок
	if (data.email?.message) return data.email.message
	if (data.phone?.message) return data.phone.message
	if (data.username?.message) return data.username.message

	// Другие возможные структуры
	if (data.message) return data.message
	if (data.msg) return data.msg
	if (data.error) return data.error
	if (data.errors && Array.isArray(data.errors)) {
		return data.errors.map(e => e.message || e.msg).join(', ')
	}

	return 'Произошла ошибка'
}

export const extractAllErrorMessages = data => {
	const messages = []

	const extractErrors = (obj, path = '') => {
		if (!obj || typeof obj !== 'object') return

		// Если это объект с message и code - добавляем его
		if (obj.message && obj.code) {
			const fieldName = path ? formatFieldName(path.split('.').pop()) : 'Ошибка'
			messages.push(`${fieldName}: ${obj.message}`)
			return
		}

		// Рекурсивно обходим все поля
		Object.keys(obj).forEach(key => {
			const value = obj[key]
			const newPath = path ? `${path}.${key}` : key

			if (typeof value === 'object' && value !== null) {
				extractErrors(value, newPath)
			}
		})
	}

	extractErrors(data)
	return messages
}
