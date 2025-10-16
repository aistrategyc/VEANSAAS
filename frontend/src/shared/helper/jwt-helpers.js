export const parseJwt = token => {
	try {
		if (typeof token !== 'string' || token.split('.').length !== 3) {
			return null
		}

		const base64Url = token.split('.')[1]

		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

		const jsonPayload = atob(base64)
		const decoded = decodeURIComponent(
			jsonPayload
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)

		return JSON.parse(decoded)
	} catch (error) {
		console.warn('Failed to parse JWT:', error)
		return null
	}
}
