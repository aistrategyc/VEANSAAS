export const setCookie = (name, value, days = 7) => {
	const date = new Date()
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)

	const expires = `expires=${date.toUTCString()}`
	const sameSite = 'SameSite=Strict'
	const secure = window.location.protocol === 'https:' ? 'Secure' : ''

	document.cookie = `${name}=${encodeURIComponent(
		value
	)}; ${expires}; path=/; ${sameSite}; ${secure}`
}

export const getCookie = name => {
	const cookies = document.cookie.split('; ')
	const cookie = cookies.find(row => row.startsWith(`${name}=`))

	if (cookie) {
		return decodeURIComponent(cookie.split('=')[1])
	}
	return null
}

export const deleteCookie = name => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
}
