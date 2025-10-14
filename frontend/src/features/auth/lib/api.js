import { api } from '@/shared/api/api'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { fetchStudios } from '@/shared/slices/studiosSlice'
import { fetchUserData } from '@/shared/slices/userSlice'
import { showAlert } from '@/shared/ui/alert/Alerts'

export const useLogin = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const dispatch = useDispatch()
	const { login } = useAuth()

	const fetchLogin = ({ data, reset }) => {
		setIsLoading(true)
		api
			.post('/auth/login', data)
			.then(response => {
				login(response.data.access_token, response.data.refresh_token, {
					expires: 7,
				})
				dispatch(fetchUserData()).unwrap()
				dispatch(fetchStudios()).unwrap()
				reset()
			})
			.catch(err => {
				setError(err.response.data.detail)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}
	return { fetchLogin, isLoading, error }
}

export const useSignup = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const navigate = useNavigate()

	const fetchSignup = ({ data, reset }) => {
		setIsLoading(true)
		api
			.post('/auth/register', data)
			.then(() => {
				showAlert.successRegister().then(() => {
					reset()
					navigate('/login')
				})
			})
			.catch(err => setError(err.response.data?.detail.detail))
			.finally(() => setIsLoading(false))
	}

	return { fetchSignup, isLoading, error }
}

export const useSignupByInvite = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const navigate = useNavigate()

	const fetchSignup = ({ data, reset }) => {
		setIsLoading(true)
		api
			.post('/auth/register-by-invite', data)
			.then(() => {
				showAlert.successRegister().then(() => {
					reset()
					navigate('/login')
				})
			})
			.catch(err => setError(err.response.data?.detail.detail))
			.finally(() => setIsLoading(false))
	}

	return { fetchSignup, isLoading, error }
}
