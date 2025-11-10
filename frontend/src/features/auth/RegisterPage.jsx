import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { useSignup } from '@/features/auth/model/api'
import { Loader } from '@/shared/ui/loader/Loader'
import { StepUser } from './StepUser'
import { StepOrganization } from './StepOrganization'
import AuthLayout from '@/widgets/auth/AuthLayout'
import { ProgressSteps } from './ProgressSteps'
import { Link } from 'react-router'

const RegisterPage = () => {
	const [step, setStep] = useState(1)
	const { fetchSignup, isLoading, error } = useSignup()
	const [formData, setFormData] = useState({ user: {}, organization: {} })

	const handleNext = userData => {
		setFormData(prev => ({ ...prev, user: userData }))
		setStep(prev => prev + 1)
	}

	const handleSubmitAll = orgData => {
		const finalData = {
			user: formData.user,
			organization: orgData,
		}
		fetchSignup({ data: finalData })
	}

	const handleBack = () => {
		setStep(prev => prev - 1)
	}
	return (
		<AuthLayout>
			<Card className='border-none shadow-none bg-transparent'>
				<CardHeader>
					<CardTitle className='text-xl font-semibold'>Регистрация</CardTitle>
					<ProgressSteps currentStep={step} totalSteps={2} />
					<CardDescription>
						{step === 1 ? 'Данные пользователя' : 'Данные организации'}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{isLoading && <Loader />}
					{error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

					<AnimatePresence mode='wait'>
						{step === 1 && (
							<motion.div
								key='step1'
								initial={{ opacity: 0, x: 40 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -40 }}
								transition={{ duration: 0.3, ease: 'easeOut' }}
							>
								<StepUser onNext={handleNext} initialData={formData.user} />
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key='step2'
								initial={{ opacity: 0, x: 40 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -40 }}
								transition={{ duration: 0.3, ease: 'easeOut' }}
							>
								<StepOrganization
									onSubmit={handleSubmitAll}
									onBack={handleBack}
									initialData={formData.organization}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					<p className='text-center text-sm text-muted-foreground mt-4'>
						Есть аккаунта?{' '}
						<Link
							to='/login'
							className='text-primary font-medium hover:underline'
						>
							Войти
						</Link>
					</p>
				</CardContent>
			</Card>
		</AuthLayout>
	)
}

export default RegisterPage
