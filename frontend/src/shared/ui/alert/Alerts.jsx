import Swal from 'sweetalert2'

export const showAlert = {
	error: (title = 'Error', text = '') => {
		return Swal.fire({
			title,
			text,
			icon: 'error',
			confirmButtonText: 'OK',
			confirmButtonColor: '#dc3545',
			customClass: {
				popup: 'rounded-lg shadow-xl',
				confirmButton:
					'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded',
			},
		})
	},


	// Нихуя не понимаю 
	// роли посмотреть и разобраться
	// клиент
	//


	success: (title = 'Success', text = '') => {
		return Swal.fire({
			title,
			text,
			icon: 'success',
			confirmButtonText: 'OK',
			confirmButtonColor: '#28a745',
			timer: 1500,
			timerProgressBar: true,
			customClass: {
				popup: 'rounded-lg shadow-xl',
				confirmButton:
					'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded',
			},
		})
	},
	successRegister: (title = 'Success', text = 'Go to login') => {
		return Swal.fire({
			title,
			text,
			icon: 'success',
			confirmButtonText: 'Login',
			confirmButtonColor: '#28a745',
			customClass: {
				popup: 'rounded-lg shadow-xl',
				confirmButton:
					'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded',
			},
		})
	},

	loading: (title = 'Loading...') => {
		return Swal.fire({
			title,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading()
			},
		})
	},
}
