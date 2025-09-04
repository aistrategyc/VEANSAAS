import { useEffect } from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/shared/api/api'

export default function VerificationEmailPage() {
	async function onVerification() {
		const params = new URLSearchParams(window.location.search)
		const token = params.get('token')
		if (token) {
			await authAPI
				.verifyToken(token)
				.then(() => {
					console.log('успех')
				})
				.catch(err => {
					console.log(err)
				})
		}
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
							<Button onClick={() => onVerification()} className='w-full'>
								Verification me
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
