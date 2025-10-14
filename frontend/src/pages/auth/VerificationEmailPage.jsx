import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'react-router-dom'
import api from '@/shared/api/client'

const VerificationEmailPage = () => {
	const [searchParams] = useSearchParams()
	const verifyToken = searchParams.get('token')

	const fetchVerifyEmail = () => {
		api
			.get('/auth/verify-email', {
				params: {
					token: verifyToken,
				},
			})
			.then(() => console.log('SUCCESS'))
			.catch(error => console.log(error))
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<main className='flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8'>
				<div className='w-full max-w-md'>
					<Card>
						<CardHeader>
							<CardTitle>Подтверждение почты</CardTitle>
							<CardDescription>
								Для использования контента верифицируйте аккаунт
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button onClick={fetchVerifyEmail} className='w-full'>
								Verification me
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}

export default VerificationEmailPage
