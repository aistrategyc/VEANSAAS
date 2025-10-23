import toast from 'react-hot-toast'

export const toastError = (message, options = {}) => {
	return toast.error(message, {
		duration: 4000,
		position: 'bottom-right',
		...options,
	})
}

export const toastSuccess = (message, options = {}) => {
	return toast.success(message, {
		duration: 4000,
		position: 'bottom-right',
		...options,
	})
}

export const toastLoading = (message, options = {}) => {
	return toast.loading(message, {
		position: 'top-right',
		...options,
	})
}

export const toastDismiss = toastId => {
	toast.dismiss(toastId)
}
