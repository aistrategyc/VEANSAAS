const TOKEN_KEY = 'auth_token'

const setCookie = (name, value, days) => {
	const date = new Date()
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
	const expires = `expires=${date.toUTCString()}`
	document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;secure`
}

const getCookie = name => {
	const nameEQ = `${name}=`
	const ca = document.cookie.split(';')

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) === ' ') c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
	}

	return null
}

const deleteCookie = name => {
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export const authService = {
	async login(credentials) {
		try {
			const response = await fetch('http://localhost:8000/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			})

			if (!response.ok) {
				console.log(response)

				const errorMessage =
					data.detail ||
					data.message ||
					data.error ||
					`Ошибка ${response.status}: ${response.statusText}`
				throw new Error(errorMessage)
			}

			const data = await response.json()

			if (data.access_token) {
				authService.setToken(data.access_token)
				return data
			}

			throw new Error('Токен не получен')
		} catch (error) {
			throw new Error(error.message || 'Ошибка входа')
		}
	},

	async register(registrationData) {
		const response = await fetch('http://localhost:8000/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(registrationData),
		})

		const data = await response.json().catch(() => ({}))

		if (!response.ok) {
			const errorMessage =
				data.detail ||
				data.message ||
				data.error ||
				`Ошибка ${response.status}: ${response.statusText}`
			throw new Error(errorMessage)
		}

		return data
	},

	logout() {
		authService.removeToken()
	},

	isAuthenticated() {
		return !!authService.getToken()
	},

	getToken() {
		return getCookie(TOKEN_KEY)
	},

	setToken(token) {
		setCookie(TOKEN_KEY, token, 7) // 7 дней
	},

	removeToken() {
		deleteCookie(TOKEN_KEY)
	},
}

export const {
	login,
	register,
	logout,
	isAuthenticated,
	getToken,
	setToken,
	removeToken,
} = authService

export default authService
